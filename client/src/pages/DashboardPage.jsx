import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Filter, CheckCircle2, Clock, ListTodo, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { TaskCard } from '../components/TaskCard';
import { TaskModal } from '../components/TaskModal';
import { Pagination } from '../components/Pagination';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { ErrorAlert } from '../components/ErrorAlert';

export const DashboardPage = () => {
  const { user } = useAuth();

  // Tasks state
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 });

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [page, setPage] = useState(1);

  // Screen states (Section 7.3)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal & operation states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch metrics stats
  const fetchStats = async () => {
    try {
      const data = await api.getTaskStats();
      if (data.stats) setStats(data.stats);
    } catch (err) {
      console.warn('Could not load task stats:', err.message);
    }
  };

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getTasks({
        page,
        limit: 6,
        status: statusFilter,
        priority: priorityFilter,
        q: searchQuery,
      });

      setTasks(data.tasks || []);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        total: data.total,
      });
    } catch (err) {
      setError(err.message || 'Failed to retrieve tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, priorityFilter, searchQuery]);

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [fetchTasks]);

  // Modal open helpers
  const handleOpenCreate = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  // Create or Update task
  const handleSaveTask = async (taskData) => {
    setIsSubmitting(true);
    try {
      if (selectedTask) {
        await api.updateTask(selectedTask._id, taskData);
        showNotification('Task updated successfully!');
      } else {
        await api.createTask(taskData);
        showNotification('Task created successfully!');
      }
      handleCloseModal();
      fetchTasks();
      fetchStats();
    } catch (err) {
      alert(`Error saving task: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await api.deleteTask(taskId);
      showNotification('Task removed successfully');
      fetchTasks();
      fetchStats();
    } catch (err) {
      alert(`Failed to delete task: ${err.message}`);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2>Task Dashboard</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Welcome back, <strong>{user?.name}</strong>. Here is your current workload.
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={18} />
          Create Task
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className={`alert alert-${notification.type}`} role="status">
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-info">
            <h4>Total Tasks</h4>
            <p>{stats.total}</p>
          </div>
          <ListTodo size={28} color="var(--primary)" />
        </div>
        <div className="metric-card">
          <div className="metric-info">
            <h4>Pending</h4>
            <p>{stats.pending}</p>
          </div>
          <Clock size={28} color="#b45309" />
        </div>
        <div className="metric-card">
          <div className="metric-info">
            <h4>In Progress</h4>
            <p>{stats.inProgress}</p>
          </div>
          <AlertCircle size={28} color="#0369a1" />
        </div>
        <div className="metric-card">
          <div className="metric-info">
            <h4>Completed</h4>
            <p>{stats.completed}</p>
          </div>
          <CheckCircle2 size={28} color="#047857" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks by title or description..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="filter-selects">
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by Status"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            className="filter-select"
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by Priority"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* The 4 States Rendering (Section 7.3) */}
      {loading ? (
        <LoadingSpinner text="Fetching your tasks..." />
      ) : error ? (
        <ErrorAlert message={error} onRetry={fetchTasks} />
      ) : tasks.length === 0 ? (
        <EmptyState
          title="No tasks to display"
          description={
            searchQuery || statusFilter || priorityFilter
              ? 'No tasks matched your specific filters. Try clearing some criteria.'
              : 'You have not created any tasks yet. Stay organized by adding your first one!'
          }
          actionText="Add your first task"
          onAction={handleOpenCreate}
        />
      ) : (
        <>
          <div className="tasks-grid">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleOpenEdit}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>

          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </>
      )}

      {/* Task Creation & Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSaveTask}
        initialTask={selectedTask}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
