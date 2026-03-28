import { Alert, Snackbar, useMediaQuery, useTheme, type AlertColor } from "@mui/material";
import React, { memo, type ReactNode } from 'react'


type Props = {
    children: ReactNode;
    open: boolean;
    autoHideMs: number | null;
    handleClose: () => void;
    severity: AlertColor;
    message: string;
}

function Toast({ children, open, autoHideMs, handleClose, severity, message }: Props) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const anchorOrigin = isMobile
        ? { vertical: "top" as const, horizontal: "center" as const }
        : { vertical: "bottom" as const, horizontal: "right" as const };

    return (
        <>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={autoHideMs}
                onClose={handleClose}
                anchorOrigin={anchorOrigin}
                sx={{
                    ...(isMobile
                        ? { top: { xs: theme.spacing(2) }, alignItems: "center" }
                        : { bottom: theme.spacing(3), right: theme.spacing(3) }),
                }}
            >
                <Alert
                    onClose={handleClose}
                    severity={severity}
                    variant="filled"
                    elevation={6}
                    sx={{
                        width: "100%",
                        maxWidth: { xs: "min(100vw - 32px, 420px)", sm: 420 },
                    }}
                >
                    {message}
                </Alert>
            </Snackbar></>
    )
}

export default memo(Toast)