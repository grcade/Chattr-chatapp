import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import useUser from '../hooks/useUser';

const WelcomePage: React.FC = () => {
  const [name, setName] = useState('');
  const { saveUsername } = useUser();

  const quickNames = ['gin', 'son', 'alex'];

  const start = () => {
    const n = name.trim();
    if (!n) return;
    saveUsername(n);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background:
          'radial-gradient(circle at top left, rgba(0, 136, 204, 0.18), transparent 30%), radial-gradient(circle at right 20%, rgba(15, 118, 110, 0.14), transparent 24%), linear-gradient(180deg, #f7fbfe 0%, #eef6fb 100%)',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.25) 100%)',
          pointerEvents: 'none',
        }}
      />

      <Container
        maxWidth="lg"
        sx={{ position: 'relative', py: { xs: 4, md: 8 } }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                width: 52,
                height: 52,
                bgcolor: '#0088cc',
                fontWeight: 800,
                boxShadow: '0 18px 40px rgba(0,136,204,0.28)',
              }}
            >
              V
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1 }}>
                VelocityChat
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Fast private rooms. Clear handshakes. No clutter.
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
              gap: { xs: 3, md: 4 },
              alignItems: 'stretch',
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: 5,
                border: '1px solid rgba(15, 23, 42, 0.08)',
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.82) 100%)',
                boxShadow: '0 28px 80px rgba(15,23,42,0.12)',
                backdropFilter: 'blur(18px)',
              }}
            >
              <Chip
                label="Realtime messaging"
                icon={<BoltRoundedIcon />}
                sx={{
                  mb: 2,
                  bgcolor: 'rgba(0, 136, 204, 0.12)',
                  color: '#006f9f',
                  fontWeight: 700,
                }}
              />

              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  lineHeight: 0.95,
                  fontSize: { xs: '3rem', md: '4.5rem' },
                  letterSpacing: '-0.05em',
                  maxWidth: '12ch',
                }}
              >
                Move conversations at velocity.
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  mt: 2.5,
                  maxWidth: '56ch',
                  color: 'text.secondary',
                  fontSize: '1.05rem',
                  lineHeight: 1.8,
                }}
              >
                VelocityChat is built for quick private room handshakes,
                lightweight real-time messaging, and a focused interface that
                gets out of your way once the conversation starts.
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 3 }}>
                {quickNames.map((quickName) => (
                  <Chip
                    key={quickName}
                    label={quickName}
                    variant="outlined"
                    onClick={() => setName(quickName)}
                    sx={{
                      borderRadius: 999,
                      fontWeight: 600,
                      borderColor: 'rgba(0, 136, 204, 0.24)',
                      '&:hover': {
                        bgcolor: 'rgba(0, 136, 204, 0.08)',
                      },
                    }}
                  />
                ))}
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <TextField
                  label="Choose a username"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      start();
                    }
                  }}
                  fullWidth
                />
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 1.5,
                    alignItems: { xs: 'stretch', sm: 'center' },
                  }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={start}
                    endIcon={<ArrowForwardRoundedIcon />}
                    disabled={!name.trim()}
                    sx={{
                      px: 3,
                      py: 1.4,
                      borderRadius: 999,
                      textTransform: 'none',
                      fontWeight: 700,
                      boxShadow: '0 18px 34px rgba(0, 136, 204, 0.22)',
                    }}
                  >
                    Enter VelocityChat
                  </Button>
                  <Typography variant="body2" color="text.secondary">
                    Use any handle to join. Private rooms are created on demand.
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 1.5,
                  mt: 4,
                }}
              >
                {[
                  {
                    icon: <ForumRoundedIcon fontSize="small" />,
                    title: 'Private rooms',
                    text: 'Each accepted request resolves to one room id.',
                  },
                  {
                    icon: <SecurityRoundedIcon fontSize="small" />,
                    title: 'Handshake flow',
                    text: 'Start with a request, then accept or reject cleanly.',
                  },
                ].map((item) => (
                  <Box
                    key={item.title}
                    sx={{
                      flex: 1,
                      p: 2,
                      borderRadius: 3,
                      bgcolor: 'rgba(241, 246, 250, 0.9)',
                      border: '1px solid rgba(15, 23, 42, 0.06)',
                    }}
                  >
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}
                    >
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: 'rgba(0, 136, 204, 0.12)',
                          color: '#006f9f',
                        }}
                      >
                        {item.icon}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 700, lineHeight: 1.1 }}>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.text}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 3 },
                borderRadius: 5,
                border: '1px solid rgba(15, 23, 42, 0.08)',
                background:
                  'linear-gradient(180deg, rgba(8, 19, 33, 0.96) 0%, rgba(12, 27, 46, 0.94) 100%)',
                color: '#eaf6ff',
                boxShadow: '0 28px 70px rgba(2, 8, 23, 0.24)',
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}>
                <Box>
                  <Typography variant="overline" sx={{ opacity: 0.72 }}>
                    Live room preview
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Instant room creation and clean handoff.
                  </Typography>
                </Box>

                {[
                  {
                    who: 'gin',
                    message: 'Want to hop on a private room?',
                    tone: 'left',
                  },
                  {
                    who: 'son',
                    message: 'Accepted. Room is open.',
                    tone: 'right',
                  },
                  {
                    who: 'VelocityChat',
                    message: 'Messages route by room id, not by guesswork.',
                    tone: 'left',
                  },
                ].map((bubble) => (
                  <Box
                    key={`${bubble.who}-${bubble.message}`}
                    sx={{
                      alignSelf:
                        bubble.tone === 'right' ? 'flex-end' : 'flex-start',
                      maxWidth: '82%',
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'rgba(234, 246, 255, 0.68)',
                        fontWeight: 700,
                      }}
                    >
                      {bubble.who}
                    </Typography>
                    <Box
                      sx={{
                        mt: 0.5,
                        px: 2,
                        py: 1.25,
                        borderRadius: 3,
                        bgcolor:
                          bubble.tone === 'right'
                            ? 'rgba(0, 136, 204, 0.22)'
                            : 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: '#f8fbff',
                      }}
                    >
                      <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                        {bubble.message}
                      </Typography>
                    </Box>
                  </Box>
                ))}

                <Divider sx={{ borderColor: 'rgba(234, 246, 255, 0.12)' }} />

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {[
                    'Socket.io',
                    'Conversation rooms',
                    'Private handshake',
                    'Redux state',
                  ].map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.08)',
                        color: '#eaf6ff',
                        borderColor: 'rgba(255,255,255,0.1)',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default WelcomePage;
