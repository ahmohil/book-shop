import React, { useState, useEffect } from "react";

import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const UndoDelete = ({ message, onUndo, open, setOpen }) => {
	// const [snackbarOpen, setSnackbarOpen] = useState(open);

	// useEffect(() => {
	// 	setSnackbarOpen(open);
	// }, [open]);

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setOpen(false);
		// setSnackbarOpen(false);
	};

	const handleUndo = () => {
		// setSnackbarOpen(false);
		onUndo();
	};

	const action = (
		<React.Fragment>
			<Button color="secondary" size="small" onClick={handleUndo}>
				UNDO
			</Button>
			<IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
				<CloseIcon fontSize="small" />
			</IconButton>
		</React.Fragment>
	);

	return <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} message={message} action={action} />;
};

export default UndoDelete;
