"use client";
import { useState } from "react";
import { 
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
 } from "@/components/ui/card";
import { 
    Avatar,
    AvatarImage,
    AvatarFallback
 } from "@/components/ui/avatar";
 import { Input } from "@/components/ui/input";
 import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
    ExternalLinkIcon,
    ForkliftIcon,
    LocateIcon,
    RecycleIcon,
    StarIcon,
    UsersIcon,
 } from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";

type UserProfile = {
    login: string;
    avatar_url: string;
    html_url: string;
    bio: string;
    followers: number;
    following: number;
    location: string;
};

type UserRepo = {
    id: number;
    name: string;
    html_url: string;
    description: string;
    stargazers_count: number;
    forks_count: number;
};

export default function GitHubProfileViewer() {
    const [username, setUsername] = useState<string>("");
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [userRepos, setUserRepos] = useState<UserRepo[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUserData = async (): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            const profileResponse = await fetch(
                `https://api.github.com/users/${username}`
            );
            if (!profileResponse.ok) {
                throw new Error("User not found!");
            }
            const profileData = await profileResponse.json();
            const reposResponse = await fetch(
                `https://api.github.com/users/${username}/repos`
            );
            if (!reposResponse.ok) {
                throw new Error("Repositories not found");
            }
            const reposData = await reposResponse.json();
            setUserProfile(profileData);
            setUserRepos(reposData);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        fetchUserData();
    };

    return(
        <div className="flex flex-col items-center justify-center min-h-screen bg-black px-4 py-8">
            <Card className="w-full max-w-3xl p-6 space-y-4 shadow-lg border-gray-600 bg-slate-800">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl text-white font-bold mb-2">
                        GitHub Profile Viewer
                    </CardTitle>
                    <CardDescription className="text-white">
                        Search for a GitHub username and View their profile and repositories, search like: Tahasiraj1
                    </CardDescription>
                </CardHeader>
                {/* Form to input GitHub username */}
                <form onSubmit={handleSubmit} className="mb-8 px-6">
                    <div className="flex items-center gap-4">
                        <Input
                        type="text"
                        placeholder="Enter a GitHub username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="flex-1 bg-gray-300 border rounded-md p-2"
                        />
                        <Button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-slate-600 text-white rounded-full"
                        >
                            {loading ? <ClipLoader className="w-4 h-4 text-white" /> : "Search"}
                        </Button>
                    </div>
                </form>
                {/* Display error message if any */}
                {error && <p className="text-red-500 text-center">{error}</p>}
                {/* Display user profile and repositories if data is fetched */}
                {userProfile && (
                    <div className="grid gap-8 px-6">
                        {/* User profile section */}
                        <div className="grid gid-cols-[120px_1fr] gap-6">
                            <div className="flex flex-row justify-center">
                            <Avatar className="w-28 h-30 border">
                                <AvatarImage src={userProfile.avatar_url} />
                                <AvatarFallback>
                                    {userProfile.login.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-2xl text-white font-bold">{userProfile.login}</h2>
                                    {userProfile.avatar_url && (
                                        <Link
                                        href={userProfile.html_url}
                                        target="_blank"
                                        className="text-black"
                                        prefetch={false}
                                        >
                                            <ExternalLinkIcon className="text-gray-300 hover:text-gray-400 active:scale-95 transition-transform transform duration-300 w-5 h-5" />
                                        </Link>
                                    )}
                                </div>
                                <p className="text-gray-300">{userProfile.bio}</p>
                                <div className="flex items-center gap-4 text-sm text-white">
                                    <div className="flex items-center gap-1">
                                        <UsersIcon className="w-4 h-4" />
                                        <span>{userProfile.followers} Followers</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <UsersIcon className="w-4 h-4" />
                                        <span>{userProfile.following} Following</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <LocateIcon className="w-4 h-4" />
                                        <span>{userProfile.location || "N/A"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* User repositories section */}
                        <div className="grid gap-6">
                            <h3 className="text-xl text-white font-bold">Repositories</h3>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
                                {userRepos.map((repo) => (
                                    <Card
                                    key={repo.id}
                                    className="shadow-md rounded-lg bg-slate-500 border-gray-500"
                                    >
                                        <CardHeader>
                                            <div className="flex items-center gap-2">
                                                <RecycleIcon className="w-6 h-6" />
                                                <CardTitle>
                                                    {repo.html_url && (
                                                        <Link
                                                        href={repo.html_url}
                                                        target="_blank"
                                                        className="hover:text-black"
                                                        prefetch={false}
                                                        >
                                                            {repo.name}
                                                        </Link>
                                                    )}
                                                </CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-gray-300">
                                                {repo.description || "No Description"}
                                            </p>
                                        </CardContent>
                                        <CardFooter className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-sm text-white">
                                                <StarIcon className="w-4 h-4" />
                                                <span>{repo.stargazers_count}</span>
                                                <ForkliftIcon className="w-4 h-4" />
                                                <span>{repo.forks_count}</span>
                                            </div>
                                            {repo.html_url && (
                                                <Link
                                                href={repo.html_url}
                                                target="_blank"
                                                className="text-white hover:text-gray-300 hover:underline"
                                                prefetch={false}
                                                >
                                                    View on GitHub
                                                </Link>
                                            )}
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}