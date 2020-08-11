import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
 import { useQuery } from 'react-query'
import Switch from "@material-ui/core/Switch";
 import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import {SearchRounded} from "@material-ui/icons";
import CustomContainer from "../container";
import HeaderBar from "../../components/appbar/appbar";
import getAllPizza from "../../services/api";
import Loader from "../../components/spinner";




function createData(pizza) {
  const {name, toppings, status} = pizza;
  const parseIngredients = toppings.map(ingredient=> ingredient.name);
  const ingredients = parseIngredients.join(',');
  return {name, ingredients, status}
};

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'ingredients', numeric: true, disablePadding: true, label: 'Ingredients' },
  { id: 'status', numeric: true, disablePadding: false, label: 'Status' },
  { id: 'action', numeric: true, disablePadding: false, label: 'Change Status' },
];

function OrdersHeader(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'center' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

OrdersHeader.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected, result, original, setResult } = props;
  const [searchName, setSearch] = React.useState('');
  const handleChangeSearch =(event) => {
    setSearch(event.target.value);

  };

  const catchReturn = (event) => {
    if (event.key === 'Enter') {
      if (searchName === ''){
        setResult(original);
      } else {
        const finalResult = result.filter(
          (item) =>
            item.name && item.name.toLowerCase().includes(searchName.toLowerCase()));
        setResult(finalResult)

      }
    }
  };

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {`Pizza Orders: ${numSelected}`}
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          Pizza Orders
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <TextField
          value={searchName}
          onChange={handleChangeSearch}
          className={classes.margin}
          id="input-with-icon-textfield"
          label="SearchBar"
          onKeyPress={catchReturn}
          InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchRounded />
            </InputAdornment>
          ),
        }}
        />
      )}

    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  result: PropTypes.instanceOf(Array).isRequired,
  setResult: PropTypes.func.isRequired
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function PizzaOrder() {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [selectedStatus, setState] = React.useState([]);
  const [result, setResult] = React.useState([]);
  const [original, SetOriginalResult] = React.useState([]);

  const isSelected = (bucket, name) => bucket ? selected.indexOf(name) !== -1 : selectedStatus.indexOf(name) !== -1;
  const { isLoading, data } = useQuery('getAllPizzas', getAllPizza, {});
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = result.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, bucket, row) => {
    const selectedIndex = bucket ? selected.indexOf(row.name) : selectedStatus.indexOf(row.name);
    const selectedBucket = bucket ? selected: selectedStatus;
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedBucket, row.name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedBucket.slice(1));
    } else if (selectedIndex === selectedBucket.length - 1) {
      newSelected = newSelected.concat(selectedBucket.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedBucket.slice(0, selectedIndex),
        selectedBucket.slice(selectedIndex + 1),
      );
    }
    if (bucket) {
      setSelected(newSelected);
    } else {
      setState(newSelected);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useMemo(()=>{
    if (!isLoading) {
      const apiData = data.data.data.map(pizza => createData(pizza))
      setResult(apiData);
      SetOriginalResult(apiData);
    }
  },[data]);


  return (
    <CustomContainer>
      {isLoading ? <Loader /> : null}
      <HeaderBar />
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <EnhancedTableToolbar numSelected={selected.length} result={result} original={original} setResult={setResult} />
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              aria-label="enhanced table"
            >
              <OrdersHeader
                classes={classes}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={result.length}
              />
              <TableBody>
                {stableSort(result, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(true, row.name);
                      const statusSelected = isSelected(false, row.name);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.name}
                          selected={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              inputProps={{ 'aria-labelledby': labelId }}
                              onClick={(event) => handleClick(event, true,  row)}
                            />
                          </TableCell>
                          <TableCell component="th" id={labelId} scope="row" padding="none">
                            {row.name}
                          </TableCell>
                          <TableCell align="center">{row.ingredients}</TableCell>
                          <TableCell align="center">
                            {statusSelected ? 'ready': 'waiting'}
                          </TableCell>
                          <TableCell align="center">
                            <Switch
                              checked={statusSelected}
                              onChange={(event) => handleClick(event, false, row)}
                              color="primary"
                              name="checkedB"
                              inputProps={{ 'aria-label': 'primary checkbox' }}
                            />

                          </TableCell>
                        </TableRow>
                      );
                    })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={result.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    </CustomContainer>

  );
}