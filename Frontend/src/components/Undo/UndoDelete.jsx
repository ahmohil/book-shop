import React, { useState, useEffect } from "react";

import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const UndoDelete = ({ message, onUndo, open }) => {
	const [snackbarOpen, setSnackbarOpen] = useState(open);

	useEffect(() => {
		setSnackbarOpen(open);
	}, [open]);

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setSnackbarOpen(false);
	};

	const handleUndo = () => {
		setSnackbarOpen(false);
		// Call the parent-provided function for undo action
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

	return (
		<Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleClose} message={message} action={action} />
	);
};

export default UndoDelete;
