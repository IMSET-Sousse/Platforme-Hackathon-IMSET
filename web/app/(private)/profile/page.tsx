'use client'

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Edit, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import AuthenticatedLayout from "@/components/layout/authenticated-layout";

interface GitHubUser {
  login: string;
  avatar_url: string;
}

interface UserProfile {
  username: string;
  avatar: string;
  description: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<UserProfile>({
    username: "",
    avatar: "",
    description: "",
  });
  const [formData, setFormData] = useState({
    description: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGitHubData = async () => {
      if (status === "loading") return;
      
      if (!session?.user?.name) {
        setIsLoading(false);
        console.error("GitHub username is missing");
        toast({
          title: "Error",
          description: "GitHub username is missing.",
          variant: "error",
        });
        return;
      }

      try {
        const response = await fetch(`https://api.github.com/users/${session.user.name}`, {
          headers: {
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch GitHub data. Status code: ${response.status}`);
        }

        const userData: GitHubUser = await response.json();
        setUser({
          username: userData.login,
          avatar: userData.avatar_url,
          description: user.description, // Keep existing description
        });
      } catch (error) {
        console.error("Error fetching GitHub user data:", error);
        toast({
          title: "Error",
          description: "Could not fetch GitHub user information.",
          variant: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchGitHubData();
  }, [session, status, toast, user.description]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, description: value }));
  };

  const handleSaveProfile = () => {
    setUser((prev) => ({ ...prev, description: formData.description }));
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
      variant: "success",
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d7b369]"></div>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  // If no session
  if (!session) {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#222222]">Please Sign In</h1>
            <p className="text-[#8b8b8bde] mt-2">You need to be signed in to view your profile.</p>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#222222]">Profile</h1>
          <p className="text-[#8b8b8bde] mt-2">Manage your profile information.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl text-[#222222]">Profile Information</CardTitle>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="text-[#d7b369] border-[#d7b369] hover:bg-[#d7b369]/10"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Avatar and Username */}
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user.avatar} alt={user.username} />
                      <AvatarFallback>{user.username ? user.username.charAt(0) : '?'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold text-[#222222]">{user.username}</h3>
                      <p className="text-[#8b8b8bde]">{user.username}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-sm font-medium text-[#222222] mb-2">Description</h3>
                    {isEditing ? (
                      <div className="space-y-4">
                        <Textarea
                          value={formData.description}
                          onChange={handleInputChange}
                          className="w-full"
                          rows={4}
                          placeholder="Describe yourself..."
                        />
                        <div className="flex justify-end space-x-3">
                          <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                          </Button>
                          <Button className="bg-[#d7b369] hover:bg-[#d89f2b]" onClick={handleSaveProfile}>
                            <Save className="mr-2 h-4 w-4" />
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[#222222]">{user.description || "No description provided."}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-[#222222]">Statistics</CardTitle>
                <CardDescription>Your contributions and activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-[#8b8b8bde]">Completed Challenges</p>
                    <p className="text-2xl font-bold text-[#555555]">3</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-[#8b8b8bde]">Commits</p>
                    <p className="text-2xl font-bold text-[#555555]">42</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-[#8b8b8bde]">Rank</p>
                    <p className="text-2xl font-bold text-[#555555]">
                      5<span className="text-sm font-normal">/50</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
