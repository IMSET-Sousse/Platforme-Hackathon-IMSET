
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Team types
export interface TeamMember {
    id: string;
    name: string;
    role: string;
    avatar: string;
    isCurrentUser: boolean;
}

export interface ApiTeam {
    id: number;
    name: string;
    description: string;
    repository_link: string;
    leader: string;
    members: string[];
    created_at: string;
    updated_at: string;
}

export interface TeamFormData {
    name: string;
    description: string;
    repository_link: string;
}

// API functions for teams
export async function fetchTeamByLeader(githubLogin: string): Promise<ApiTeam | null> {
    try {
        const response = await fetch(`${API_URL}/teams/by_leader/?github_login=${encodeURIComponent(githubLogin)}`);

        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new Error('Failed to fetch team');
        }

        const data = await response.json();
        return data.length > 0 ? data[0] : null;
    } catch (error) {
        console.error('Error fetching team:', error);
        return null;
    }
}

export async function fetchTeamById(id: number): Promise<ApiTeam | null> {
    try {
        const response = await fetch(`${API_URL}/teams/${id}/`);

        if (!response.ok) {
            throw new Error('Failed to fetch team');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching team:', error);
        return null;
    }
}

export async function createTeam(teamData: TeamFormData, leaderLogin: string): Promise<ApiTeam | null> {
    try {
        const response = await fetch(`${API_URL}/teams/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...teamData,
                leader: leaderLogin,
                members: [], // Start with empty members array
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to create team');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating team:', error);
        return null;
    }
}

export async function updateTeam(id: number, teamData: Partial<TeamFormData>): Promise<ApiTeam | null> {
    try {
        const response = await fetch(`${API_URL}/teams/${id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(teamData),
        });

        if (!response.ok) {
            throw new Error('Failed to update team');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating team:', error);
        return null;
    }
}

export async function deleteTeam(id: number): Promise<boolean> {
    try {
        const response = await fetch(`${API_URL}/teams/${id}/`, {
            method: 'DELETE',
        });

        return response.ok;
    } catch (error) {
        console.error('Error deleting team:', error);
        return false;
    }
}

export async function addTeamMember(teamId: number, memberLogin: string): Promise<ApiTeam | null> {
    try {
        // First, get the current team
        const team = await fetchTeamById(teamId);
        if (!team) return null;

        // Add the new member if not already present
        if (!team.members.includes(memberLogin)) {
            const updatedMembers = [...team.members, memberLogin];

            const response = await fetch(`${API_URL}/teams/${teamId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ members: updatedMembers }),
            });

            if (!response.ok) {
                throw new Error('Failed to add team member');
            }

            return await response.json();
        }

        return team;
    } catch (error) {
        console.error('Error adding team member:', error);
        return null;
    }
}

export async function removeTeamMember(teamId: number, memberLogin: string): Promise<ApiTeam | null> {
    try {
        // First, get the current team
        const team = await fetchTeamById(teamId);
        if (!team) return null;

        // Remove the member
        const updatedMembers = team.members.filter(m => m !== memberLogin);

        const response = await fetch(`${API_URL}/teams/${teamId}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ members: updatedMembers }),
        });

        if (!response.ok) {
            throw new Error('Failed to remove team member');
        }

        return await response.json();
    } catch (error) {
        console.error('Error removing team member:', error);
        return null;
    }
} 