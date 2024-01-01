import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useEffect } from "react";

const DropDown = ({ options, selectedOption, label }) => {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [selectedIndex, setSelectedIndex] = React.useState(0);
	const open = Boolean(anchorEl);
	const handleClickListItem = (event) => {
		setAnchorEl(event.currentTarget);
	};

	useEffect(() => {
		selectedOption(options[selectedIndex]);
	}, [selectedIndex]);

	const handleMenuItemClick = (event, index) => {
		setSelectedIndex(index);
		setAnchorEl(null);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div>
			<List component="nav" aria-label="Device settings" sx={{ bgcolor: "background.paper" }}>
				<ListItem button id="lock-button" aria-expanded={open ? "true" : undefined} onClick={handleClickListItem}>
					<ListItemText primary={`${label}`} secondary={options[selectedIndex]} />
				</ListItem>
			</List>
			<Menu
				id="lock-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					"aria-labelledby": "lock-button",
					role: "listbox",
				}}>
				{options.map((option, index) => (
					<MenuItem
						key={option}
						selected={index === selectedIndex}
						onClick={(event) => handleMenuItemClick(event, index)}>
						{option}
					</MenuItem>
				))}
			</Menu>
		</div>
	);
};

export default DropDown;
