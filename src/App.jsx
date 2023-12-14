import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardHeader,
  IconButton,
  styled,
  CardContent,
  CardActions,
  Collapse,
  Tooltip,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Menu,
  DialogActions,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";

const App = () => {
  const [tasks, setTasks] = useState([]);

  const getTasks = async () => {
    await axios
      .get("http://127.0.0.1:5000/tasks")
      .then((response) => {
        setTasks(response.data);
        console.log(response);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <>
      <Box
        sx={{
          background: "linear-gradient(to right bottom, #54C5FF, #0157FF)",
        }}
        display="flex"
        alignItems="center"
        flexDirection="column"
        height="100vh"
        rowGap={3}
      >
        <Box
          marginTop="50px"
          height="50px"
          width="1800px"
          borderRadius="10px"
          display="flex"
          alignItems="center"
          padding="10px"
          columnGap={3}
          sx={{
            boxShadow: 3,
            background: "linear-gradient(to right bottom, #FFFFFF, #00A9FF)",
          }}
        >
          <Typography paddingLeft="20px">What are you working on?</Typography>
          <AddTaskButton getTasks={getTasks} />
          <SeeAllCategory />
        </Box>
        <Box width="1820px" border="2px solid #FFFFFF"></Box>
        <Box
          width="1820px"
          display="flex"
          alignItems="start"
          columnGap={3}
        ></Box>
        <Typography fontFamily="Silkscreen" variant="h2" color="#FFFFFF">
          To Do Lists
        </Typography>
        {tasks.map((task) => (
          <TaskContainer task={task} getTasks={getTasks} key={task.id} />
        ))}
      </Box>
    </>
  );
};

export const AddTaskButton = ({getTasks}) => {
  const [openTask, setOpenTask] = useState(false);
  const [titleValue, setTitleValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [statusValue, setStatusValue] = useState("");
  const [dueDateValue, setDueDateValue] = useState("");

  const handleOpenTask = () => setOpenTask(true);
  const handleCloseTask = () => setOpenTask(false);

  const handleChange = (event) => {
    setCategory(event.target.value);
  };

  const AddTask = async () => {
    await axios
      .post("http://127.0.0.1:5000/tasks/add",{
        title: titleValue,
        description: descriptionValue,
        status: "pending",
        due_date: dueDateValue,
      })
      .then(() => {
        setTitleValue("");
        setDescriptionValue("");
        setDueDateValue("");
      });
  };


  return (
    <>
      <Button
        variant="outlined"
        onClick={handleOpenTask}
        sx={{ textTransform: "none" }}
      >
        Add new Task
      </Button>
      <Dialog maxWidth="md" open={openTask} onClose={handleCloseTask}>
        <DialogTitle
          textAlign="center"
          borderBottom="2px solid #808080"
          fontSize={30}
          fontWeight="bold"
        >
          Task Form
        </DialogTitle>
        <DialogContent>
          <Stack justifyContent="center" alignItems="center" rowGap={2}>
            <Box marginTop="10px">
              <Typography>Title</Typography>
              <TextFieldStyled
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
              />
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              columnGap={2}
            >
              {/* <FormControl sx={{ width: "300px" }}>
                <InputLabel>Category</InputLabel>
                <Select onChange={handleChange} label="Category">
                  <MenuItem value={1}>House Chores</MenuItem>
                  <MenuItem value={2}>Exercise</MenuItem>
                  <MenuItem value={3}>Save the Earth</MenuItem>
                </Select>
              </FormControl> */}
              <TextField
                placeholder="YYYY-MM-DD"
                variant="outlined"
                label="Due Date"
                value={dueDateValue}
                onChange={(e) => setDueDateValue(e.target.value)}
              />
            </Box>
            <Box>
              <Typography>Description</Typography>
              <textarea
                value={descriptionValue}
                onChange={(e) => setDescriptionValue(e.target.value)}
                style={{
                  width: "600px",
                  height: "150px",
                  resize: "none",
                  borderRadius: "6px",
                  fontSize: "17px",
                  padding: "15px",
                }}
              />
            </Box>
            <Box
              display="flex"
              justifyContent="end"
              alignItems="end"
              width="640px"
            >
              <Button
                onClick={AddTask}
                variant="contained"
                sx={{ textTransform: "none" }}
              >
                Add
              </Button>
            </Box>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const TaskContainer = ({ task, getTasks }) => {
  const [expanded, setExpanded] = React.useState(false);
  const [titleValue, setTitleValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [statusValue, setStatusValue] = useState("");
  const [dueDateValue, setDueDateValue] = useState("");
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [confirmUpdateDialog, setConfirmUpdateDialog] = useState(false);
  const [openEditTask, setOpenEditTask] = useState(false);

  const handleOpenEditTask = () => setOpenEditTask(true);
  const handleCloseEditTask = () => setOpenEditTask(false);

  const currentDate = new Date(task.due_date);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const formattedDate = currentDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const handleOpenDeleteDialog = () => setOpenDeleteDialog(true);
  const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);


  const deleteTask = async () => {
    await axios
      .delete(`http://127.0.0.1:5000/tasks/${task.id}`)
      .then(() => {
        getTasks();
      })
      .catch((err) => console.log(err));
  };

  const updateTask = async () => {
    try {
      const response = await axios.put(`http://127.0.0.1:5000/tasks/${task.id}`, {
        title: titleValue,
        description: descriptionValue,
        status: "pending",
        due_date: dueDateValue,
      });
      getTasks();
      setTitleValue("");
      setDescriptionValue("");
      setDueDateValue("");
    } catch (error) {
      console.error("Error updating task!", error);
    }
  };


  return (
    <>
      <Card
        key={task.id}
        sx={{
          width: "1820px",
          borderRadius: "10px",
          boxShadow: 1,
        }}
      >
        <CardHeader
          action={
            <IconButton aria-label="settings" onClick={handleOpenUserMenu}>
              <Box
                display="flex"
                justifyContent="center"
                border="1px solid #e8e8e8"
                borderRadius={1}
              >
                <MoreHorizIcon />
              </Box>
            </IconButton>
          }
          title={task.title}
          subheader={formattedDate}
        />
        <Menu
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          {["Delete", "Edit"].map((action) => (
            <MenuItem
              key={action}
              onClick={() => {
                setAnchorElUser(null);
                action === "Delete"
                  ? handleOpenDeleteDialog()
                  : handleOpenEditTask();
              }}
              sx={{
                display: "flex",
                flexDirection: "column",
                rowGap: "10px",
              }}
            >
              {action}
            </MenuItem>
          ))}
        </Menu>
        <Dialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Delete Task</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this task?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={deleteTask} color="primary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog maxWidth="md" open={openEditTask} onClose={handleCloseEditTask}>
          <DialogTitle
            textAlign="center"
            borderBottom="2px solid #808080"
            fontSize={30}
            fontWeight="bold"
          >
            Edit Task Form
          </DialogTitle>
          <DialogContent>
            <Stack justifyContent="center" alignItems="center" rowGap={2}>
              <Box marginTop="10px">
                <Typography>Title</Typography>
                <TextFieldStyled
                  value={titleValue}
                  onChange={(e) => setTitleValue(e.target.value)}
                />
              </Box>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                columnGap={2}
              >
                {/* <FormControl sx={{ width: "300px" }}>
                <InputLabel>Category</InputLabel>
                <Select onChange={handleChange} label="Category">
                  <MenuItem value={1}>House Chores</MenuItem>
                  <MenuItem value={2}>Exercise</MenuItem>
                  <MenuItem value={3}>Save the Earth</MenuItem>
                </Select>
              </FormControl> */}
                <TextField
                  placeholder="YYYY-MM-DD"
                  variant="outlined"
                  label="Due Date"
                  value={dueDateValue}
                  onChange={(e) => setDueDateValue(e.target.value)}
                />
              </Box>
              <Box>
                <Typography>Description</Typography>
                <textarea
                  value={descriptionValue}
                  onChange={(e) => setDescriptionValue(e.target.value)}
                  style={{
                    width: "600px",
                    height: "150px",
                    resize: "none",
                    borderRadius: "6px",
                    fontSize: "17px",
                    padding: "15px",
                  }}
                />
              </Box>
              <Box
                display="flex"
                justifyContent="end"
                alignItems="end"
                width="640px"
              >
                <Button
                  onClick={updateTask}
                  variant="contained"
                  sx={{ textTransform: "none" }}
                >
                  Save
                </Button>
              </Box>
            </Stack>
          </DialogContent>
        </Dialog>
        <CardActions disableSpacing>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography>{task.description}</Typography>
          </CardContent>
        </Collapse>
      </Card>
    </>
  );
};

const SeeAllCategory = () => {
  const [openCategory, setOpenCategory] = useState(false);
  const [categoryValue, setCategoryValue] = useState("");
  const [categories, setCategories] = useState([]);
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  const handleOpenCategory = () => setOpenCategory(true);
  const handleCloseCategory = () => setOpenCategory(false);

  const addCategory = async () => {
    await axios
      .post("http://127.0.0.1:5000/categories/add", {
        name: categoryValue,
      })
      .then(() => {
        getCategory();
        setCategoryValue("");
      });
  };

  const getCategory = async () => {
    await axios
      .get("http://127.0.0.1:5000/categories")
      .then((response) => {
        setCategories(response.data);
        console.log(response);
      })
      .catch((err) => console.log(err));
  };

  const deleteCategory = async (id) => {
    await axios
      .delete(`http://127.0.0.1:5000/categories/${id}`)
      .then(() => {
        getCategory();
      })
      .catch((err) => console.log(err));
  };

  const editCategory = async (id) => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:5000/categories/${id}`,
        {
          name: categoryValue,
        }
      );
      getCategory();
      setCategoryValue("");
      setEditingCategoryId(null);
    } catch (error) {
      console.error("Error updating task!", error);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <>
      <ButtonStyled onClick={handleOpenCategory} sx={{ color: "#FFFFFF" }}>
        Categories
      </ButtonStyled>
      <Dialog maxWidth="md" open={openCategory} onClose={handleCloseCategory}>
        <DialogTitle
          textAlign="center"
          borderBottom="2px solid #808080"
          fontSize={30}
          fontWeight="bold"
        >
          Categories
        </DialogTitle>
        <DialogContent display="flex" flexDirection="column">
          <Stack justifyContent="center" alignItems="center" rowGap={2}>
            {categories.map((category) => (
              <Box
                key={category.id}
                display="flex"
                justifyContent="center"
                alignItems="center"
                columnGap={3}
                paddingTop="5px"
              >
                <TextField
                  variant="standard"
                  value={
                    editingCategoryId === category.id
                      ? categoryValue
                      : category.name
                  }
                  inputProps={{
                    style: { textAlign: "center" },
                  }}
                  onChange={(e) => {
                    setCategoryValue(e.target.value);
                    setEditingCategoryId(category.id);
                  }}
                />
                {editingCategoryId === category.id ? (
                  <Button
                    onClick={() => editCategory(category.id)}
                    variant="contained"
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    onClick={() => setEditingCategoryId(category.id)}
                    variant="contained"
                  >
                    Edit
                  </Button>
                )}
                <Button
                  onClick={() => deleteCategory(category.id)}
                  variant="contained"
                >
                  Delete
                </Button>
              </Box>
            ))}
            <TextField
              value={categoryValue}
              onChange={(e) => setCategoryValue(e.target.value)}
              variant="outlined"
              inputProps={{
                style: { textAlign: "center" },
              }}
            />
            <Button onClick={addCategory} variant="contained">
              Add Category
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const TextFieldStyled = styled(TextField)({
  width: "640px",
  borderRadius: "10px",
});

const ButtonStyled = styled(Button)({
  width: "300px",
  height: "50px",
  marginLeft: "1100px",
  textTransform: "none",
  background: "linear-gradient(to right bottom, #0057E7, #00A9FF)",
});

export default App;
