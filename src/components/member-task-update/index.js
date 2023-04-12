import { useState } from 'react';
import Modal from '@components/UI/modal/index';
import Spinner from '@components/UI/spinner';
import { TASK_TYPE, TASK_LOOKS } from '@constants/AppConstants';
import { useTaskContext } from '@store/tasks/tasks-context';
import classNames from './member-task-update.module.scss';
import { moveTask } from '../../helper-functions/action-handlers';

const MemberTaskUpdate = () => {
  const {
    showMemberTaskUpdateModal,
    setShowMemberTaskUpdateModal,
    isNoteworthy,
    isCollapsed,
    taskId,
  } = useTaskContext();

  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  const [collapsedState, setCollapsedState] = useState(false);
  const [taskType, setTaskType] = useState('');

  const changeTaskType = async (taskid) => {
    setIsUpdating(true);
    const data = { isNoteworthy: !isNoteworthy };
    const res = await moveTask(taskid, data);
    setIsUpdating(false);
    if (res.status === 204) {
      setUpdateStatus(
        `Task moved to ${
          isNoteworthy ? TASK_TYPE.OTHER : TASK_TYPE.NOTEWORTHY
        }! reloading...`
      );
      window.location.reload();
    } else {
      setUpdateStatus(`There was an error while updating the task`);
    }
  };

  const collapseTask = async (taskid) => {
    setCollapsedState(true);
    const data = { isCollapsed: !isCollapsed };
    const res = await moveTask(taskid, data);
    setCollapsedState(false);
    if (res.status === 204) {
      setTaskType(
        `Task ${
          isCollapsed ? TASK_LOOKS.EXPANDED : TASK_LOOKS.COLLAPSED
        }! reloading...`
      );
      window.location.reload();
    } else {
      setTaskType(`There was an error while updating the task`);
    }
  };

  const renderTaskUpdateButtton = () => {
    const task = isNoteworthy ? TASK_TYPE.OTHER : TASK_TYPE.NOTEWORTHY;
    const taskLook = isCollapsed ? TASK_LOOKS.EXPANDED : TASK_LOOKS.COLLAPSED;

    if (updateStatus === '' && taskType === '') {
      return (
        <div>
          <button
            className={classNames.changeTaskType}
            type="button"
            onClick={() => changeTaskType(taskId)}
          >
            Move Task to {task}
          </button>
          <button
            className={classNames.changeTaskType}
            type="button"
            onClick={() => collapseTask(taskId)}
          >
            {taskLook} Task
          </button>
        </div>
      );
    }
    return <p className={classNames.updateText}>{updateStatus || taskType}</p>;
  };

  return (
    <>
      <Modal
        show={showMemberTaskUpdateModal}
        closeModal={() => {
          setShowMemberTaskUpdateModal(false);
        }}
      >
        {isUpdating || collapsedState ? <Spinner /> : renderTaskUpdateButtton()}
      </Modal>
    </>
  );
};

export default MemberTaskUpdate;
