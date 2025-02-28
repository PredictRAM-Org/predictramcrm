import { useQuery } from '@tanstack/react-query';

import {
  Box,
  Chip,
  Stack,
  Button,
  Avatar,
  Dialog,
  Typography,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { fDate } from 'src/utils/format-time';

import TaskService from 'src/services/Task.service';

import FetchLoader from 'src/components/loader/fetch-loader';
import AccessControl from 'src/components/Accesscontrol';
import { useRouter } from 'src/routes/hooks';
import { ROLES, STATUS_COLOR_MAP } from 'src/enums';
import PredictRamService from 'src/services/PredictRam.service';
import RiskView from 'src/components/RiskView';

function TaskViewModal({ handelClose, open, id = null, determineStatus }) {
  const router = useRouter();

  const { isLoading, data } = useQuery({
    queryKey: ['tasks', id],
    queryFn: () => TaskService.getById(id, { populate: 'analyst,client' }),
    select: (res) => res?.data,
    enabled: !!id,
  });

  const { data: riskData } = useQuery({
    queryKey: ['risk-score', data?.client?._id],
    queryFn: () => PredictRamService.getRiskScore(data?.client?.id),
    select: (res) => res?.data?.riskScores,
    enabled: !!data?.client?.id,
  });

  return (
    <Dialog open={open} onClose={handelClose} fullWidth>
      <DialogContent sx={{ borderRadius: '10px', boxShadow: 'none' }}>
        {isLoading && <FetchLoader />}
        {!isLoading && (
          <Box>
            <Typography gutterBottom variant="h5" component="div">
              {data?.title}
            </Typography>
            <Typography gutterBottom variant="subtitle1">
              Expiery Date {fDate(data?.expieryDate)}
            </Typography>
            <Chip
              color={data && STATUS_COLOR_MAP[determineStatus?.(data)]}
              label={data && determineStatus?.(data)}
            />
            <Stack gap={2} alignItems="flex-start" mt={2}>
              <Typography variant="body2">{data?.description}</Typography>

              <Stack alignItems="flex-start">
                <Typography fontWeight="semiBold">Task From Client</Typography>
                <Chip
                  avatar={
                    <Avatar
                      alt="Natacha"
                      src={
                        data?.client?.avatar ||
                        `https://ui-avatars.com/api/?name=${data?.client?.firstName}+${data?.client?.lastName}`
                      }
                    />
                  }
                  label={`${data?.client?.firstName} ${data?.client?.lastName} (${data?.client?.email})`}
                  variant="outlined"
                />
                <Stack direction="row" gap={3}>
                  {riskData?.riskProfile && (
                    <RiskView riskScore={riskData?.riskScore} headerText="Risk Profile is" />
                  )}
                  {riskData?.riskTolerance && (
                    <RiskView riskScore={riskData?.riskTolerance} headerText="Risk Tolerance is" />
                  )}
                  {riskData?.riskCapacity && (
                    <RiskView riskScore={riskData?.riskCapacity} headerText="Risk Capacity is" />
                  )}
                </Stack>
                <AccessControl accepted_roles={[ROLES.ADMIN, ROLES.EMPLOYEE]}>
                  <Typography fontWeight="semiBold">Assigned Analyst</Typography>
                  <Chip
                    avatar={
                      <Avatar
                        alt="Natacha"
                        src={
                          data?.analyst?.avatar ||
                          `https://ui-avatars.com/api/?name=${data?.analyst?.firstName}+${data?.analyst?.lastName}`
                        }
                      />
                    }
                    label={`${data?.analyst?.firstName} ${data?.analyst?.lastName} (${data?.analyst?.email})`}
                    variant="outlined"
                  />
                </AccessControl>
              </Stack>
            </Stack>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <AccessControl accepted_roles={[ROLES.ANALYST]}>
          <Button
            variant="contained"
            color="inherit"
            onClick={() => router.push(`/market-call/add?client=${data?.client?.id}`)}
          >
            Create Market Call
          </Button>
        </AccessControl>
        <Button color="error" variant="contained" onClick={handelClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TaskViewModal;
