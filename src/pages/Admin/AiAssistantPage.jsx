import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import StopCircleOutlinedIcon from "@mui/icons-material/StopCircleOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import {
  createChatSession,
  deleteChatSession,
  getStoredChatbotOwnerId,
  listChatSessions,
  renameChatSession,
  setStoredChatbotOwnerId,
  streamChatMessage,
} from "../../services/chatbotService";

const formatTimestamp = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const buildSessionTitle = (session, index) =>
  session?.title?.trim() || `Conversation ${index + 1}`;

export default function AiAssistantPage() {
  const theme = useTheme();
  const messagesEndRef = useRef(null);
  const streamAbortRef = useRef(null);

  const [ownerId, setOwnerId] = useState(getStoredChatbotOwnerId());
  const [sessions, setSessions] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState("");
  const [messagesByThread, setMessagesByThread] = useState({});
  const [prompt, setPrompt] = useState("");
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [creatingSession, setCreatingSession] = useState(false);
  const [sending, setSending] = useState(false);
  const [pageError, setPageError] = useState("");
  const [renameDialog, setRenameDialog] = useState({
    open: false,
    threadId: "",
    title: "",
  });

  const activeMessages = useMemo(
    () => messagesByThread[activeThreadId] || [],
    [messagesByThread, activeThreadId],
  );
  const activeSession = sessions.find((session) => session.thread_id === activeThreadId) || null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages, sending]);

  const ensureOwnerId = useCallback(() => {
    const normalizedOwnerId = ownerId.trim();
    if (!normalizedOwnerId) {
      setPageError("Owner ID is required to use the AI assistant.");
      return "";
    }
    setStoredChatbotOwnerId(normalizedOwnerId);
    return normalizedOwnerId;
  }, [ownerId]);

  const loadSessions = useCallback(async () => {
    const normalizedOwnerId = ensureOwnerId();
    if (!normalizedOwnerId) {
      setSessions([]);
      setActiveThreadId("");
      return;
    }

    setLoadingSessions(true);
    setPageError("");
    try {
      const response = await listChatSessions(normalizedOwnerId);
      const list = Array.isArray(response) ? response : response ? [response] : [];
      setSessions(list);
      setActiveThreadId((prev) => {
        if (prev && list.some((session) => session.thread_id === prev)) {
          return prev;
        }
        return list[0]?.thread_id || "";
      });
    } catch (error) {
      setPageError(error?.message || "Unable to load chat sessions.");
    } finally {
      setLoadingSessions(false);
    }
  }, [ensureOwnerId]);

  useEffect(() => {
    if (!ownerId.trim()) return;
    loadSessions();
  }, [loadSessions, ownerId]);

  useEffect(() => () => {
    streamAbortRef.current?.abort();
  }, []);

  const handleCreateSession = async () => {
    const normalizedOwnerId = ensureOwnerId();
    const firstMessage = prompt.trim();
    if (!normalizedOwnerId || !firstMessage) return;

    setCreatingSession(true);
    setPageError("");
    try {
      const session = await createChatSession(normalizedOwnerId, {
        first_message: firstMessage,
      });

      setSessions((prev) => [session, ...prev]);
      setMessagesByThread((prev) => ({
        ...prev,
        [session.thread_id]: [
          {
            id: `${Date.now()}-user`,
            role: "user",
            content: firstMessage,
            createdAt: new Date().toISOString(),
          },
          {
            id: `${Date.now()}-assistant`,
            role: "assistant",
            content: "",
            createdAt: new Date().toISOString(),
            isStreaming: true,
          },
        ],
      }));
      setActiveThreadId(session.thread_id);
      setPrompt("");
      await handleStreamMessage(normalizedOwnerId, session.thread_id, firstMessage, true);
    } catch (error) {
      setPageError(error?.message || "Unable to create a chat session.");
    } finally {
      setCreatingSession(false);
    }
  };

  const handleStreamMessage = async (normalizedOwnerId, threadId, message, isNewSession = false) => {
    streamAbortRef.current?.abort();
    const controller = new AbortController();
    streamAbortRef.current = controller;
    setSending(true);

    if (!isNewSession) {
      setMessagesByThread((prev) => ({
        ...prev,
        [threadId]: [
          ...(prev[threadId] || []),
          {
            id: `${Date.now()}-user`,
            role: "user",
            content: message,
            createdAt: new Date().toISOString(),
          },
          {
            id: `${Date.now()}-assistant`,
            role: "assistant",
            content: "",
            createdAt: new Date().toISOString(),
            isStreaming: true,
          },
        ],
      }));
    }

    try {
      await streamChatMessage({
        ownerId: normalizedOwnerId,
        threadId,
        message,
        signal: controller.signal,
        onChunk: (payload) => {
          setMessagesByThread((prev) => {
            const threadMessages = [...(prev[threadId] || [])];
            const assistantIndex = [...threadMessages]
              .reverse()
              .findIndex((item) => item.role === "assistant");

            if (assistantIndex === -1) return prev;

            const actualIndex = threadMessages.length - 1 - assistantIndex;
            const assistantMessage = threadMessages[actualIndex];

            if (payload.chunk) {
              threadMessages[actualIndex] = {
                ...assistantMessage,
                content: `${assistantMessage.content}${payload.chunk}`,
                isStreaming: !payload.done,
              };
            }

            if (payload.done) {
              threadMessages[actualIndex] = {
                ...threadMessages[actualIndex],
                isStreaming: false,
              };
            }

            return {
              ...prev,
              [threadId]: threadMessages,
            };
          });
        },
      });

      await loadSessions();
    } catch (error) {
      if (error?.name === "AbortError") return;
      setPageError(error?.message || "Unable to get a response from the assistant.");
      setMessagesByThread((prev) => {
        const threadMessages = [...(prev[threadId] || [])];
        const assistantIndex = [...threadMessages]
          .reverse()
          .findIndex((item) => item.role === "assistant");
        if (assistantIndex !== -1) {
          const actualIndex = threadMessages.length - 1 - assistantIndex;
          threadMessages[actualIndex] = {
            ...threadMessages[actualIndex],
            isStreaming: false,
            content:
              threadMessages[actualIndex].content ||
              "I could not generate a response. Please try again.",
          };
        }
        return {
          ...prev,
          [threadId]: threadMessages,
        };
      });
    } finally {
      setSending(false);
    }
  };

  const handleSend = async () => {
    const normalizedOwnerId = ensureOwnerId();
    const message = prompt.trim();
    if (!normalizedOwnerId || !message) return;

    if (!activeThreadId) {
      await handleCreateSession();
      return;
    }

    setPrompt("");
    await handleStreamMessage(normalizedOwnerId, activeThreadId, message);
  };

  const handleRename = async () => {
    const normalizedOwnerId = ensureOwnerId();
    const nextTitle = renameDialog.title.trim();
    if (!normalizedOwnerId || !renameDialog.threadId || !nextTitle) return;

    try {
      await renameChatSession(normalizedOwnerId, renameDialog.threadId, {
        title: nextTitle,
      });
      setSessions((prev) =>
        prev.map((session) =>
          session.thread_id === renameDialog.threadId
            ? { ...session, title: nextTitle }
            : session,
        ),
      );
      setRenameDialog({ open: false, threadId: "", title: "" });
    } catch (error) {
      setPageError(error?.message || "Unable to rename this session.");
    }
  };

  const handleDelete = async (threadId) => {
    const normalizedOwnerId = ensureOwnerId();
    if (!normalizedOwnerId || !threadId) return;

    try {
      await deleteChatSession(normalizedOwnerId, threadId);
      setSessions((prev) => prev.filter((session) => session.thread_id !== threadId));
      setMessagesByThread((prev) => {
        const next = { ...prev };
        delete next[threadId];
        return next;
      });
      if (activeThreadId === threadId) {
        setActiveThreadId("");
      }
    } catch (error) {
      setPageError(error?.message || "Unable to delete this session.");
    }
  };

  const handleStop = () => {
    streamAbortRef.current?.abort();
    setSending(false);
  };

  const handleStartNewConversation = () => {
    streamAbortRef.current?.abort();
    setSending(false);
    setActiveThreadId("");
    setPrompt("");
    setPageError("");
  };

  const sidebarSummary = useMemo(() => {
    if (!sessions.length) {
      return "No conversations yet";
    }
    return `${sessions.length} conversation${sessions.length === 1 ? "" : "s"}`;
  }, [sessions.length]);

  return (
    <Container maxWidth={false} disableGutters sx={{ px: { xs: 2, md: 3 } }}>
      <Paper
        elevation={0}
        sx={{
          minHeight: "calc(100vh - 112px)",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "320px 1fr" },
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          background:
            "linear-gradient(180deg, rgba(250,251,252,1) 0%, rgba(245,247,250,1) 100%)",
        }}
      >
        <Box
          sx={{
            borderRight: { md: "1px solid" },
            borderColor: "divider",
            bgcolor: "#101828",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            minHeight: { xs: 320, md: "auto" },
          }}
        >
          <Box sx={{ p: 2.5 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
              <Avatar sx={{ bgcolor: alpha("#fff", 0.14), color: "#fff" }}>
                <SmartToyIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Hotel AI Assistant
                </Typography>
                <Typography variant="body2" sx={{ color: alpha("#fff", 0.68) }}>
                  {sidebarSummary}
                </Typography>
              </Box>
            </Stack>

            <TextField
              fullWidth
              size="small"
              label="Owner ID"
              value={ownerId}
              onChange={(event) => setOwnerId(event.target.value)}
              placeholder="Enter owner UUID"
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  bgcolor: alpha("#fff", 0.08),
                  color: "#fff",
                },
                "& .MuiInputLabel-root": {
                  color: alpha("#fff", 0.72),
                },
              }}
              InputLabelProps={{ shrink: true }}
            />

            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleStartNewConversation}
              disabled={creatingSession || sending}
              sx={{
                justifyContent: "flex-start",
                bgcolor: "#2563eb",
                "&:hover": { bgcolor: "#1d4ed8" },
              }}
            >
              Start New Conversation
            </Button>
          </Box>

          <Divider sx={{ borderColor: alpha("#fff", 0.08) }} />

          <Box sx={{ flex: 1, overflowY: "auto", px: 1.5, py: 1 }}>
            <Typography
              variant="overline"
              sx={{
                px: 1,
                pb: 1,
                display: "block",
                color: alpha("#fff", 0.6),
                letterSpacing: "0.08em",
              }}
            >
              Chat History
            </Typography>
            {loadingSessions ? (
              <Box sx={{ py: 4, textAlign: "center" }}>
                <CircularProgress size={24} sx={{ color: "#fff" }} />
              </Box>
            ) : (
              <List disablePadding>
                {sessions.map((session, index) => {
                  const isActive = session.thread_id === activeThreadId;
                  return (
                    <Paper
                      key={session.thread_id}
                      elevation={0}
                      sx={{
                        mb: 1,
                        bgcolor: isActive ? alpha("#fff", 0.12) : "transparent",
                        border: "1px solid",
                        borderColor: isActive ? alpha("#fff", 0.12) : "transparent",
                      }}
                    >
                      <ListItemButton onClick={() => setActiveThreadId(session.thread_id)}>
                        <ListItemText
                          primary={buildSessionTitle(session, index)}
                          secondary={formatTimestamp(session.updated_at || session.created_at)}
                          primaryTypographyProps={{
                            noWrap: true,
                            fontWeight: isActive ? 700 : 500,
                            color: "#fff",
                          }}
                          secondaryTypographyProps={{
                            noWrap: true,
                            color: alpha("#fff", 0.65),
                          }}
                        />
                        <Tooltip title="Rename">
                          <IconButton
                            size="small"
                            sx={{ color: alpha("#fff", 0.74) }}
                            onClick={(event) => {
                              event.stopPropagation();
                              setRenameDialog({
                                open: true,
                                threadId: session.thread_id,
                                title: session.title || buildSessionTitle(session, index),
                              });
                            }}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            sx={{ color: alpha("#fff", 0.74) }}
                            onClick={(event) => {
                              event.stopPropagation();
                              handleDelete(session.thread_id);
                            }}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </ListItemButton>
                    </Paper>
                  );
                })}
              </List>
            )}
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "calc(100vh - 112px)" }}>
          <Box
            sx={{
              px: { xs: 2, md: 4 },
              py: 2.5,
              borderBottom: "1px solid",
              borderColor: "divider",
              bgcolor: alpha(theme.palette.primary.main, 0.03),
            }}
          >
            <Typography variant="h5" fontWeight={700}>
              {activeSession?.title || "New Conversation"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {activeSession
                ? "Continue this conversation or ask a follow-up."
                : "Ask about bookings, occupancy, pricing trends, and owner-side operations."}
            </Typography>
          </Box>

          {pageError && (
            <Alert severity="error" sx={{ mx: { xs: 2, md: 4 }, mt: 2 }}>
              {pageError}
            </Alert>
          )}

          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              px: { xs: 2, md: 4 },
              py: 3,
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
            }}
          >
            {activeMessages.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  maxWidth: 760,
                  mx: "auto",
                  p: { xs: 3, md: 4 },
                  borderRadius: 4,
                  textAlign: "center",
                  border: "1px dashed",
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                  bgcolor: alpha(theme.palette.primary.main, 0.02),
                }}
              >
                <Avatar
                  sx={{
                    mx: "auto",
                    mb: 2,
                    width: 56,
                    height: 56,
                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                    color: theme.palette.primary.main,
                  }}
                >
                  <ForumOutlinedIcon />
                </Avatar>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Start a new owner conversation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Enter an owner ID, type your first message below, and the assistant will create a new session.
                </Typography>
              </Paper>
            ) : (
              activeMessages.map((message) => {
                const isAssistant = message.role === "assistant";
                return (
                  <Stack
                    key={message.id}
                    direction="row"
                    spacing={2}
                    sx={{
                      alignSelf: isAssistant ? "stretch" : "flex-end",
                      maxWidth: "100%",
                    }}
                  >
                    {isAssistant && (
                      <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                        <SmartToyIcon />
                      </Avatar>
                    )}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        maxWidth: { xs: "100%", md: "78%" },
                        borderRadius: 3,
                        bgcolor: isAssistant
                          ? "#fff"
                          : alpha(theme.palette.primary.main, 0.1),
                        border: "1px solid",
                        borderColor: isAssistant
                          ? alpha("#000", 0.08)
                          : alpha(theme.palette.primary.main, 0.18),
                        ml: isAssistant ? 0 : "auto",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}
                      >
                        {message.content || (message.isStreaming ? "Thinking..." : "")}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mt: 1 }}
                      >
                        {formatTimestamp(message.createdAt)}
                      </Typography>
                    </Paper>
                    {!isAssistant && (
                      <Avatar sx={{ bgcolor: "#111827" }}>
                        <PersonIcon />
                      </Avatar>
                    )}
                  </Stack>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </Box>

          <Box
            sx={{
              p: { xs: 2, md: 3 },
              borderTop: "1px solid",
              borderColor: "divider",
              bgcolor: "#fff",
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                borderRadius: 4,
                border: "1px solid",
                borderColor: alpha(theme.palette.primary.main, 0.12),
              }}
            >
              <TextField
                fullWidth
                multiline
                minRows={3}
                maxRows={10}
                placeholder="Ask the assistant about revenue, occupancy, property performance, bookings, or owner operations..."
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSend();
                  }
                }}
                variant="standard"
                InputProps={{ disableUnderline: true }}
              />

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mt: 1.5 }}
              >
                <Typography variant="caption" color="text.secondary">
                  Enter sends. Shift + Enter adds a new line.
                </Typography>
                <Stack direction="row" spacing={1}>
                  {sending && (
                    <Button
                      variant="outlined"
                      color="inherit"
                      onClick={handleStop}
                      startIcon={<StopCircleOutlinedIcon />}
                    >
                      Stop
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    onClick={handleSend}
                    disabled={!prompt.trim() || creatingSession || sending}
                    endIcon={
                      creatingSession || sending ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <SendRoundedIcon />
                      )
                    }
                  >
                    Send
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </Box>
        </Box>
      </Paper>

      <Dialog
        open={renameDialog.open}
        onClose={() => setRenameDialog({ open: false, threadId: "", title: "" })}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Rename Conversation</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Title"
            value={renameDialog.title}
            onChange={(event) =>
              setRenameDialog((prev) => ({ ...prev, title: event.target.value }))
            }
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setRenameDialog({ open: false, threadId: "", title: "" })}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={handleRename}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
