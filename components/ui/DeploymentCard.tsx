import React from 'react';

interface DeploymentCardProps {
  id: string;
  repositoryUrl: string;
  branch: string;
  status: 'pending' | 'in_progress' | 'awaiting_approval' | 'approved' | 'rejected' | 'completed' | 'failed';
  createdAt: string;
}

export const DeploymentCard: React.FC<DeploymentCardProps> = ({
  id,
  repositoryUrl,
  branch,
  status,
  createdAt,
}) => {
  const getStatusColor = (status: DeploymentCardProps['status']) => {
    const colors = {
      pending: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      awaiting_approval: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    };
    return colors[status];
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {repositoryUrl}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Branch: <span className="font-mono">{branch}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(createdAt).toLocaleString()}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}
        >
          {status.replace('_', ' ')}
        </span>
      </div>
      <div className="mt-3 pt-3 border-t">
        <p className="text-xs text-gray-500">ID: {id}</p>
      </div>
    </div>
  );
};
