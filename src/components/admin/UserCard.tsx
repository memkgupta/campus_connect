import React, { useState } from 'react';
import { Shield, ShieldAlert, User, Calendar, AtSign, Check, X } from 'lucide-react';

interface UserData {
  _id: string;
  profile: string;
  name: string;
  username: string;
  verified: boolean;
  role: string;
  bio: string;
  interests: string[];
  socials: string[];
  createdAt: string;
  updatedAt: string;
  contributions: any[];
  projects: any[];
}

interface UserCardProps {
  user: UserData;
}

export function UserCard({ user }: UserCardProps) {
  const [isBanned, setIsBanned] = useState(false);

  const handleBanToggle = () => {
    setIsBanned(!isBanned);
    // Here you would typically make an API call to update the user's ban status
    // For example: await updateUserBanStatus(user._id, !isBanned);
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-300" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-100 flex items-center">
                {user.name}
                {user.verified && (
                  <Check className="w-5 h-5 text-blue-400 ml-2" />
                )}
              </h2>
              <p className="text-gray-400 flex items-center">
                <AtSign className="w-4 h-4 mr-1" />
                {user.username}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm ${
              user.role === 'USER' 
                ? 'bg-blue-900/50 text-blue-200 border border-blue-700' 
                : 'bg-purple-900/50 text-purple-200 border border-purple-700'
            }`}>
              {user.role}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {user.bio && (
            <p className="text-gray-300">
              {user.bio}
            </p>
          )}

          <div className="flex items-center text-sm text-gray-400">
            <Calendar className="w-4 h-4 mr-2" />
            Joined {new Date(user.createdAt).toLocaleDateString()}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-700">
            <div className="flex space-x-4 text-sm">
              <span className="text-gray-400">Projects: {user.projects}</span>
              <span className="text-gray-400">Contributions: {user.contributions}</span>
            </div>
            <button
              onClick={handleBanToggle}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                isBanned
                  ? 'bg-green-900/30 text-green-300 hover:bg-green-900/50 border border-green-700'
                  : 'bg-red-900/30 text-red-300 hover:bg-red-900/50 border border-red-700'
              }`}
            >
              {isBanned ? (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Unban User
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 mr-2" />
                  Ban User
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}