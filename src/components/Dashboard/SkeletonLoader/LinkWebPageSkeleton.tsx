import { Globe, Link, Clock, ExternalLink } from "lucide-react";

const SkeletonBox = ({ className = "", rounded = "rounded-2xl" }) => (
  <div className={`bg-gray-200 animate-pulse ${rounded} ${className}`}></div>
);

export default function LinkWebPageSkeleton() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-orange-500 rounded-2xl mb-4 shadow-lg">
                        <Globe className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-black mb-2">
                        Kelola Link Website
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Kelola dan perbarui informasi link website resmi dengan mudah dan aman
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Form Section Skeleton */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl shadow-xl border border-green-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-400 to-orange-400 px-8 py-6">
                                <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                                    <Link className="w-5 h-5" />
                                    Informasi Website
                                </h2>
                            </div>
                            
                            <div className="p-8">
                                <div className="space-y-6">
                                    {/* Nama Website Field Skeleton */}
                                    <div className="space-y-2">
                                        <label className="flex font-semibold text-gray-700 items-center gap-2">
                                        <Globe className="w-4 h-4" />
                                        Nama Website
                                        </label>
                                        <SkeletonBox className="w-full h-12" />
                                    </div>

                                    {/* Link Website Field Skeleton */}
                                    <div className="space-y-2">
                                        <label className="flex font-semibold text-gray-700 items-center gap-2">
                                        <ExternalLink className="w-4 h-4" />
                                        Link Website
                                        </label>
                                        <SkeletonBox className="w-full h-12" />
                                    </div>

                                    {/* Button Skeleton */}
                                    <SkeletonBox className="w-full h-16" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Skeleton */}
                    <div className="space-y-6">
                        {/* Last Updated Card Skeleton */}
                        <div className="bg-white rounded-3xl shadow-lg border border-green-100 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <Clock className="w-5 h-5 text-green-600" />
                                </div>
                                <h3 className="font-semibold text-gray-800">Status Terakhir</h3>
                            </div>
                            <SkeletonBox className="w-32 h-4 mb-2" />
                            <SkeletonBox className="w-full h-5" />
                        </div>

                        {/* Preview Card Skeleton */}
                        <div className="bg-white rounded-3xl shadow-lg border border-green-100 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                    <ExternalLink className="w-5 h-5 text-orange-600" />
                                </div>
                                <h3 className="font-semibold text-gray-800">Preview</h3>
                            </div>
                            <div className="space-y-4">
                                {/* Nama Preview Skeleton */}
                                <div>
                                    <SkeletonBox className="w-12 h-3 mb-1" />
                                    <SkeletonBox className="w-3/4 h-5" />
                                </div>
                                {/* Link Preview Skeleton */}
                                <div>
                                    <SkeletonBox className="w-8 h-3 mb-1" />
                                    <SkeletonBox className="w-full h-5" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}