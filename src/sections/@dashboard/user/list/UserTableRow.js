import PropTypes from 'prop-types';
// @mui
import { Stack, Avatar, Checkbox, TableRow, TableCell, Typography } from '@mui/material';
// components

import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------
UserTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
};

export default function UserTableRow({ row, selected, onSelectRow }) {
  const { name, balance, totalPoured, isVerified } = row;

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} />
            <Typography variant="body2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>
          <Typography variant="body2" noWrap>
            $ {balance.toFixed(0)}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" noWrap>
            {totalPoured.toFixed(2)} oz
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Iconify
            icon={isVerified ? 'eva:checkmark-circle-fill' : 'eva:clock-outline'}
            sx={{
              width: 20,
              height: 20,
              color: 'success.main',
              ...(!isVerified && { color: 'warning.main' }),
            }}
          />
        </TableCell>
      </TableRow>
    </>
  );
}
