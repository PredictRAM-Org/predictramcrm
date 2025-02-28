import { useState } from 'react';
import { isAfter } from 'date-fns';
import { useQuery } from '@tanstack/react-query';

import { Chip, MenuItem } from '@mui/material';

import { fDate } from 'src/utils/format-time';
import cleanObject from 'src/utils/cleanObject';

import { STATUS_COLOR_MAP, TASK_STATUS } from 'src/enums';
import TaskService from 'src/services/Task.service';

import Iconify from 'src/components/iconify';
import BaseTable from 'src/components/table/BaseTable';
import TaskViewModal from 'src/components/modal/task/task-view-modal';
import AnalystUpdateModal from 'src/components/modal/task/analyst-update-modal';

// ----------------------------------------------------------------------

export default function TaskTable({ filterQuery, setFilterQuery }) {
  const [showTask, setShowTask] = useState(false);
  const [analystUpdate, setAnalystUpdate] = useState(false);
  const [taskId, setTaskId] = useState('');

  const handelCloseTask = () => {
    setShowTask(false);
    setTaskId('');
  };

  const handelCloseAnalystUpdate = () => {
    setAnalystUpdate(false);
    setTaskId('');
  };

  const determineStatus = (data) => {
    const { status, expieryDate } = data;
    if (status === TASK_STATUS.PENDING && isAfter(new Date(), new Date(expieryDate)))
      return TASK_STATUS.EXPIRED;
    return status;
  };

  const tableFormat = [
    { label: 'Title', accessor: 'title' },
    {
      label: 'Analyst',
      accessor: ({ analyst }) => `${analyst?.firstName} ${analyst?.lastName} (${analyst?.email})`,
    },
    {
      label: 'Client',
      accessor: ({ client }) => `${client?.firstName} ${client?.lastName} (${client?.email})`,
    },
    {
      label: 'Status',
      accessor: (d) => (
        <Chip color={STATUS_COLOR_MAP[determineStatus(d)]} label={determineStatus(d)} />
      ),
    },
    {
      label: 'Expirey Date',
      accessor: ({ expieryDate }) => fDate(expieryDate),
    },
  ];

  const { data = [], isLoading } = useQuery({
    queryKey: ['tasks', filterQuery],
    queryFn: () => TaskService.get(cleanObject({ ...filterQuery, populate: 'client,analyst' })),
    select: (res) => res?.data || [],
  });

  return (
    <>
      <TaskViewModal
        handelClose={handelCloseTask}
        open={showTask}
        id={taskId}
        determineStatus={determineStatus}
      />
      <AnalystUpdateModal handelClose={handelCloseAnalystUpdate} open={analystUpdate} id={taskId} />

      <BaseTable
        filter={filterQuery}
        tableData={data?.tasks || []}
        loading={isLoading}
        tableDataFormat={tableFormat}
        setFilter={setFilterQuery}
        filterables={['name']}
        customDocCount={data?.total}
        customPagination
        actions={[
          (d) => (
            <MenuItem
              onClick={() => {
                setTaskId(d?.id);
                setShowTask(true);
              }}
            >
              <Iconify icon="carbon:view-filled" sx={{ mr: 2 }} />
              View Task
            </MenuItem>
          ),
          (d) =>
            (d?.status === TASK_STATUS.REJECTED ||
              (d?.status === TASK_STATUS.PENDING &&
                isAfter(new Date(), new Date(d?.expieryDate)))) && (
              <MenuItem
                onClick={() => {
                  setTaskId(d?.id);
                  setAnalystUpdate(true);
                }}
              >
                <Iconify icon="material-symbols:change-circle" sx={{ mr: 2 }} /> Change Analyst
              </MenuItem>
            ),
        ]}
      />
    </>
  );
}
