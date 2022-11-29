import PropTypes from 'prop-types';
import { sentenceCase } from 'change-case';
// @mui
import {
  Box,
  Card,
  Table,
  Button,
  Divider,
  TableRow,
  TableBody,
  TableCell,
  CardHeader,
  TableContainer,
} from '@mui/material';
// components
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
import { TableHeadCustom } from '../../../../components/table';

// ----------------------------------------------------------------------

AppDeviceStatus.propTypes = {
  title: PropTypes.string,
  tableData: PropTypes.array,
  subheader: PropTypes.string,
  tableLabels: PropTypes.array,
};

export default function AppDeviceStatus({ title, subheader, tableData, tableLabels, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <TableContainer sx={{ overflow: 'unset' }}>
        <Scrollbar>
          <Table>
            <TableHeadCustom headLabel={tableLabels} />

            <TableBody>
              {tableData.map((row) => (
                <AppNewDeviceRow key={row.id} row={row} />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
{/* 
      <Divider />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button size="small" color="inherit" endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}>
          View All
        </Button>
      </Box> */}
    </Card>
  );
}

// ----------------------------------------------------------------------

AppNewDeviceRow.propTypes = {
  row: PropTypes.shape({
    name: PropTypes.string,
    status: PropTypes.string,
    approved: PropTypes.bool,
  }),
};

function AppNewDeviceRow({ row }) {
  // const handleButtonClick 

  return (
    <>
      <TableRow>
        <TableCell>{row.name}</TableCell>

        <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }} >
          <Label
            variant="soft"
            color={
              (row.status === 'online' && 'success') || (row.status === 'offline' && 'error')
            }
          >
            {sentenceCase(row.status)}
          </Label>
        </TableCell>

        <TableCell align="right">
        {
          row.approved ? (
          <Button variant="contained">Pour</Button>
          ) : (
          <Button variant="outlined">Request</Button>
          )
        }
        </TableCell>
      </TableRow>
    </>
  );
}
