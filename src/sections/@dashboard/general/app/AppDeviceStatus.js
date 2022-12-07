import PropTypes from 'prop-types';
import { sentenceCase } from 'change-case';
// @mui
import {
  Card,
  Table,
  Button,
  TableRow,
  TableBody,
  TableCell,
  CardHeader,
  TableContainer,
} from '@mui/material';

import { LoadingButton } from '@mui/lab';
// components
import Label from '../../../../components/label';
import Scrollbar from '../../../../components/scrollbar';
import { TableHeadCustom } from '../../../../components/table';

// ----------------------------------------------------------------------

AppDeviceStatus.propTypes = {
  title: PropTypes.string,
  tableData: PropTypes.array,
  subheader: PropTypes.string,
  tableLabels: PropTypes.array,
  onDeviceClick: PropTypes.func,
};

export default function AppDeviceStatus({ title, subheader, tableData, tableLabels, onDeviceClick, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <TableContainer sx={{ overflow: 'unset' }}>
        <Scrollbar>
          <Table>
            <TableHeadCustom headLabel={tableLabels} />

            <TableBody>
              {tableData.map((row) => (
                <AppNewDeviceRow key={row.id} row={row} onDeviceClick={onDeviceClick} />
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
    id: PropTypes.string,
    name: PropTypes.string,
    status: PropTypes.string,
    approved: PropTypes.bool,
    pending: PropTypes.bool,
  }),
  onDeviceClick: PropTypes.func,
};

function AppNewDeviceRow({ row, onDeviceClick }) {
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
            row.pending ? (
              <LoadingButton variant="contained" size="small" disabled>
                Request Pending
              </LoadingButton>
            ) : (
              row.approved ? (
                  <Button
                    variant="contained"
                    {...(row.status === 'offline' && { disabled: true })}
                    onClick={() => {
                      onDeviceClick(row.id, row.approved);
                    }}>
                    Pour
                  </Button>
              ) : (
                    <Button
                      variant="outlined"
                      onClick={() => {
                        onDeviceClick(row.id, row.approved);
                      }}>
                      Request
                    </Button>
              )
            )
            }
        </TableCell>
      </TableRow>
    </>
  );
}
