import { useState } from 'react';
import { isAfter } from 'date-fns';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Chip, MenuItem } from '@mui/material';

import { fDate } from 'src/utils/format-time';
import cleanObject from 'src/utils/cleanObject';

import { STATUS_COLOR_MAP, TASK_STATUS } from 'src/enums';
import TaskService from 'src/services/Task.service';

import Iconify from 'src/components/iconify';
import BaseTable from 'src/components/table/BaseTable';
import TaskViewModal from 'src/components/modal/task/task-view-modal';
import AnalystUpdateModal from 'src/components/modal/task/analyst-update-modal';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useConfirm } from 'material-ui-confirm';

// ----------------------------------------------------------------------
const confirmObj = (title, description, confirmationText) => ({
  title: <h3 style={{ margin: 0 }}>{title}</h3>,
  description: <h4 style={{ margin: 0 }}>{description}</h4>,
  cancellationButtonProps: { variant: 'contained', color: 'error', autoFocus: false },
  confirmationButtonProps: { variant: 'contained', color: 'success' },
  confirmationText,
});

export default function TaskTable({ filterQuery, setFilterQuery }) {
  const user = useSelector((state) => state?.user?.details);
  const queryClient = useQueryClient();
  const confirm = useConfirm();
  const [showTask, setShowTask] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState(false);
  const [taskId, setTaskId] = useState('');

  const handelCloseTask = () => {
    setShowTask(false);
    setTaskId('');
  };

  const handelCloseStatusUpdate = () => {
    setStatusUpdate(false);
    setTaskId('');
  };

  const determineStatus = (d) => {
    const { rejectedBy, notRespondedBy, status, expieryDate } = d;
    if (rejectedBy.includes(user.id)) return TASK_STATUS.REJECTED;
    if (notRespondedBy.includes(user.id)) return TASK_STATUS.EXPIRED;
    if (status === TASK_STATUS.PENDING && isAfter(new Date(), new Date(expieryDate)))
      return TASK_STATUS.EXPIRED;
    return status;
  };

  const tableFormat = [
    { label: 'Title', accessor: 'title' },
    {
      label: 'Client',
      accessor: ({ client }) => `${client?.firstName} ${client?.lastName} (${client?.email})`,
    },
    {
      label: 'Assigned By',
      accessor: ({ createdBy }) =>
        `${createdBy?.firstName} ${createdBy?.lastName} (${createdBy?.email})`,
    },
    {
      label: 'Status',
      accessor: (d) => (
        <Chip color={STATUS_COLOR_MAP[determineStatus(d)]} label={determineStatus(d)} />
      ),
    },
    {
      label: 'Expirey Date',
      accessor: (d) => (determineStatus(d) === TASK_STATUS.PENDING ? fDate(d?.expieryDate) : '-'),
    },
  ];

  const { data = [], isLoading } = useQuery({
    queryKey: ['analyst-tasks', filterQuery],
    queryFn: () =>
      TaskService.getAnalystTask(cleanObject({ ...filterQuery, populate: 'client,createdBy' })),
    select: (res) => res?.data || [],
  });

  const { mutate } = useMutation({
    mutationFn: (d) => TaskService.put(d?.id, cleanObject({ status: d?.status })),
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: (d) => {
      queryClient.invalidateQueries('analyst-tasks');
      toast.success(d.message);
    },
  });

  return (
    <>
      <TaskViewModal
        handelClose={handelCloseTask}
        open={showTask}
        id={taskId}
        determineStatus={determineStatus}
      />
      <AnalystUpdateModal handelClose={handelCloseStatusUpdate} open={statusUpdate} id={taskId} />
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
            determineStatus(d) === TASK_STATUS.PENDING && (
              <MenuItem
                onClick={async () => {
                  await confirm(
                    confirmObj(
                      `Are you sure you want to mark this task as copmplete ?`,
                      'You can not revert back',
                      `Yes, COMPLETE`
                    )
                  );
                  mutate({ id: d?.id, status: TASK_STATUS.COMPLETE });
                }}
              >
                <Iconify icon="fluent-mdl2:accept" sx={{ mr: 2 }} /> Complete
              </MenuItem>
            ),
          (d) =>
            determineStatus(d) === TASK_STATUS.PENDING && (
              <MenuItem
                onClick={async () => {
                  await confirm(
                    confirmObj(
                      `Are you sure you want to REJECT this task ?`,
                      'You can not revert back',
                      `Yes, REJECT`
                    )
                  );
                  mutate({ id: d?.id, status: TASK_STATUS.REJECTED });
                }}
              >
                <Iconify icon="gridicons:cross" sx={{ mr: 2 }} /> Reject
              </MenuItem>
            ),
        ]}
      />
    </>
  );
}
