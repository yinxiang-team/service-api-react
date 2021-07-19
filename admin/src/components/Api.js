import { makeStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import Eco from '@material-ui/icons/Eco';
import Http from '@material-ui/icons/Http';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import * as React from "react";
import Divider from "@material-ui/core/Divider";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import FormControl from "@material-ui/core/FormControl";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import MenuItem from '@material-ui/core/MenuItem';
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";

const indexJson = require('./apis/index.json');

function createData(name, calories, className) {
  return { name, calories, className };
}

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 500,
  },
  table_title: {
    width: 100,
    background: "#ABD473",
    height: 20,
    padding: '0 10px',
  },
  table_content: {
    background: "#ABD473",
    padding: '0',
  },
  tr: {
    height: 20,
  },
  text_field: {
    height: 30,
    padding: '5px 5px',
  },
  json: {
    padding: '5px 5px',
  },
  root: {
    width: '100%',
    maxWidth: 700,
    backgroundColor: '#cfe8fc',
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  formControl: {
    margin: theme.spacing(1),
    width: 260,
  },
}));

export default function Api() {
  const classes = useStyles();
  const serviceNames = indexJson.map(value => value.name);
  const branches = function loadBranches() {
    const ret = [];
    indexJson.map((value, index) => ret[index] = value.branches.map(branch => branch.name));
    return ret;
  }();
  const services = function loadServices() {
    return indexJson.map(value => value.branches.map(branch => branch.services.map(service => service)));
  }();
  const init_api_data = function loadIndex() {
    return indexJson.map(value => {
      // console.log('value: ', value);
      return value.branches.map(b => {
        return b.services.map(s => {
          const data = require('./apis/' + value.name + '/' + b.name + '/' + s);
          // console.log("data: ", data);
          const ret = [];
          data.forEach((value, index) => {
            ret[index] = {
              name: value.name,
              data: [
                createData('PATH', value.path, classes.text_field),
                createData('METHOD', value.method, classes.text_field),
                createData('HEADER', value.header, classes.json),
                createData('BODY', value.body, classes.json),
                createData('RESPONSE', value.response, classes.json),
              ],
              open: false,
            };
          });
          // console.log("ret: ", ret);
          return ret;
        });
      });
    });
  };
  const [apis, setApis] = React.useState(init_api_data);
  const [openApis, setOpenApis] = React.useState(false);
  const [serviceIndex, setServiceIndex] = React.useState(0);
  const [branchIndex, setBranchIndex] = React.useState(0);
  const [subServiceIndex, setSubServiceIndex] = React.useState(0);

  const handleClick = index => {
    apis[serviceIndex][branchIndex][subServiceIndex][index].open =
      !apis[serviceIndex][branchIndex][subServiceIndex][index].open;
    setApis(apis);
    setOpenApis(!openApis);
  };

  const handleCloseService = (event) => {
    setServiceIndex(event.currentTarget.getAttribute('id'));
    setBranchIndex(0);
    setSubServiceIndex(0);
  };

  const handleCloseBranch = (event) => {
    setBranchIndex(event.currentTarget.getAttribute('id'));
    setSubServiceIndex(0);
  };

  const handleCloseSubService = (event) => {
    setSubServiceIndex(event.currentTarget.getAttribute('id'));
  };

  return (
    <div>
      <CssBaseline />
      <Container maxWidth="sm">
        <Typography component="div" style={{ backgroundColor: '#cfe8fc' }}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">gRPC service</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={serviceIndex}
              onChange={handleCloseService}
              label="gRPC service"
            >
              {
                serviceNames.map((option, index) => (
                  <MenuItem key={option} selected={index === 0} value={index} id={index}>
                    {option}
                  </MenuItem>
                ))
              }
            </Select>
          </FormControl>

          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">branch</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={branchIndex}
              onChange={handleCloseBranch}
              label="branch"
            >
              {
                branches[serviceIndex].map((option, index) => (
                  <MenuItem key={option} selected={index === 0} value={index} id={index}>
                    {option}
                  </MenuItem>
                ))
              }
            </Select>
          </FormControl>

          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">service</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={subServiceIndex}
              onChange={handleCloseSubService}
              label="branch"
            >
              {
                services[serviceIndex][branchIndex].map((option, index) => (
                  <MenuItem key={option} selected={index === 0} value={index} id={index}>
                    {option}
                  </MenuItem>
                ))
              }
            </Select>
          </FormControl>

          <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                {serviceNames[serviceIndex]} API [By Envoy from gRPC]
              </ListSubheader>
            }
            className={classes.root}
          >
            <Divider />
            {apis[serviceIndex][branchIndex][subServiceIndex].map((api, index) => (
              <div key={"ListItem-" + index}>
                <ListItem button onClick={() => handleClick(index)}>
                  <ListItemIcon>
                    <Http /><Eco />
                  </ListItemIcon>
                  <ListItemText primary={api.name} />
                  {api.open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={api.open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItem className={classes.nested}>
                      <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="api table">
                          <TableBody>
                            {api.data.map((row) => (
                              <TableRow key={row.name} className={row.className}>
                                <TableCell align="right" component="th" scope="row" className={classes.table_title}>
                                  {row.name}
                                </TableCell>
                                <TableCell align="left" className={classes.table_content}>
                                  <FormControl fullWidth variant="outlined">
                                    <OutlinedInput
                                      disabled
                                      id="outlined-adornment-amount"
                                      value={row.calories}
                                      multiline
                                      className={row.className}
                                    />
                                  </FormControl>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </ListItem>
                  </List>
                </Collapse>
                <Divider />
              </div>
            ))}
          </List>
        </Typography>
      </Container>
    </div>
  );
}