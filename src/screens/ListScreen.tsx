import {
  Alert,
  Autocomplete,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import SearchIcon from "@mui/icons-material/Search";
const columns: GridColDef<(typeof rows)[number]>[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "firstName",
    headerName: "First name",
    width: 150,
    editable: true,
    renderCell(params) {
      return <Chip label={params.row.firstName} color="info" />;
    },
  },
  {
    field: "lastName",
    headerName: "Last name",
    width: 150,
    editable: true,
  },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    width: 110,
    editable: true,
  },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    // width: 160,
    flex:1,
    valueGetter: (value, row) => `${row.firstName || ""} ${row.lastName || ""}`,
  },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 14 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 31 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 31 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 11 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 10, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

const ListScreen = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  useEffect(() => {
    console.log("조회");
  }, [paginationModel]);

  return (
    <Stack gap={2} flex={1}>
      <Stack>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            MUI
          </Link>
          <Link
            underline="hover"
            color="inherit"
            href="/material-ui/getting-started/installation/"
          >
            Core
          </Link>
          <Typography color="text.primary">Breadcrumbs</Typography>
        </Breadcrumbs>
      </Stack>
      {/* <Stack flexDirection={"row"} justifyContent={"space-between"} gap={2}>
        <Box flex={1}>
          <Paper elevation={3} variant="outlined">
            <Typography>ASD</Typography>
          </Paper>
        </Box>
        <Box flex={1}>
          <Paper elevation={3}>
            <Typography>ASD</Typography>
          </Paper>
        </Box>
        <Box flex={1}>
          <Paper elevation={3}>
            <Typography>ASD</Typography>
          </Paper>
        </Box>
      </Stack> */}
      <Stack
        sx={{
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Alert variant="outlined" severity="success">
          This is an outlined success Alert.
        </Alert>
      </Stack>
      <Stack
        // flex={1}
        sx={{
          // backgroundColor:theme.palette.background.paper,
          justifyContent: "center",
        }}
      >
        <Paper elevation={3}>
          <Stack>
            <Stack
              flexDirection={"row"}
              gap={2}
              flex={1}
              p={2}
              borderBottom={1}
              borderColor={"#F0F0F0"}
            >
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={[
                  { label: "The Shawshank Redemption", year: 1994 },
                  { label: "The Godfather", year: 1972 },
                  { label: "The Godfather: Part II", year: 1974 },
                ]}
                sx={{ flex: 1 }}
                renderInput={(params) => (
                  <TextField {...params} label="Status" />
                )}
              />
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={[
                  { label: "The Shawshank Redemption", year: 1994 },
                  { label: "The Godfather", year: 1972 },
                  { label: "The Godfather: Part II", year: 1974 },
                ]}
                sx={{ flex: 1 }}
                renderInput={(params) => (
                  <TextField {...params} label="Movie" />
                )}
              />
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={[
                  { label: "The Shawshank Redemption" },
                  { label: "The Godfather", year: 1972 },
                  { label: "The Godfather: Part II", year: 1974 },
                ]}
                sx={{ flex: 1 }}
                renderInput={(params) => (
                  <TextField {...params} label="Movie" />
                )}
              />
            </Stack>
            <Stack flexDirection={"row"} p={2} justifyContent={"space-between"}>
              <Stack flexDirection={"row"} gap={1}>
                <OutlinedInput size="small" placeholder="Search" />
                <Button variant="outlined" color="primary" size="small">
                  <SearchIcon color="primary" />
                  <Typography variant="h4">Search</Typography>
                </Button>
              </Stack>
              <Stack flexDirection={"row"} gap={1}>
                <Button variant="outlined" color="primary" size="small">
                  <DownloadIcon color="primary" />
                  <Typography variant="h4">Download</Typography>
                </Button>
                <Button variant="outlined" size="small">
                  <UploadIcon color="primary" />
                  <Typography variant="h4">Upload</Typography>
                </Button>
                <Button variant="contained" size="small">
                  <AddIcon
                    sx={{
                      color: "white",
                    }}
                  />
                  <Typography variant="h4" color={"white"}>
                    Add
                  </Typography>
                </Button>
                <Button variant="contained" size="small">
                  <RemoveIcon
                    sx={{
                      color: "white",
                    }}
                  />
                  <Typography variant="h4" color={"white"}>
                    Remove
                  </Typography>
                </Button>
              </Stack>
            </Stack>
          </Stack>
          <Stack flex={1} sx={{}}>
            <Box
              sx={{
                flex: 1,
                backgroundColor: theme.palette.background.paper,
                // backgroundColor:'red'
              }}
            >
              <DataGrid
                rows={rows}
                columns={columns}
                pagination
                paginationMode="client"
                pageSizeOptions={[5, 10, 25]}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                // autoPageSize
                loading={loading}
                checkboxSelection
                disableRowSelectionOnClick
                localeText={{
                  MuiTablePagination: {
                    labelRowsPerPage: "페이지 행",
                  },
                }}
                sx={{
                  "&.MuiDataGrid-root": {
                    border: "none",
                    backgroundColor: theme.palette.background.paper,
                  },
                  "& .MuiDataGrid-columnHeader": {
                    backgroundColor: theme.palette.primary.light,
                  },
                  "& .MuiDataGrid-filler": {
                    // backgroundColor: theme.palette.primary.light,
                  },
                  
                  // MuiDataGrid-topContainer MuiDataGrid-container--top
                  "& .MuiDataGrid-iconSeparator": {
                    // display: "none",
                  },
                  "& .MuiDataGrid-columnHeader, .MuiDataGrid-cell": {
                    // borderRight: 0,
                    // backgroundColor: 'red'
                  },
                  "& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell": {
                    // borderBottom: 0,
                  },
                  "& .MuiDataGrid-cell": {
                    // color: theme.palette.primary.contrastText,
                  },
                  "& .MuiPaginationItem-root": {
                    // borderRadius: 0,
                    // borderWidth: 0,
                  },
                  ".MuiDataGrid-columnSeparator": {
                    // display: "none",
                  },
                }}
              />
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </Stack>
  );
};

export default ListScreen;
