import React from "react";
import { Modal } from "antd";
import { motion } from "framer-motion";

/**
 * CampaignTypeSelector - Modern, minimalistic modal for selecting campaign type
 */
const CampaignTypeSelector = ({
    isOpen,
    onClose,
    onSelectSingle,
    onSelectMulti,
    darkMode = false
}) => {
    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={820}
            centered
            destroyOnClose
            wrapClassName={darkMode ? "dark" : ""}
            className="campaign-type-modal"
            closable={true}
            styles={{
                content: {
                    padding: 0,
                    borderRadius: 24,
                    overflow: 'hidden'
                },
                mask: {
                    backdropFilter: 'blur(8px)',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)'
                }
            }}
        >
            <div className="p-10">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                        Start a new campaign
                    </h1>
                    <p className="text-gray-500 text-base">
                        What type of recruitment campaign would you like to create?
                    </p>
                </div>

                {/* Options */}
                <div className="grid grid-cols-2 gap-5">
                    {/* Single Job Campaign */}
                    <button
                        onClick={onSelectSingle}
                        className="group relative text-left"
                    >
                        <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 transition-all duration-300 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-50 hover:-translate-y-1">
                            {/* Illustration */}
                            <div className="relative h-36 mb-5 rounded-xl bg-gradient-to-br from-violet-50/50 to-purple-50/50 flex items-center justify-center overflow-hidden">
                                {/* Abstract shapes */}
                                <div className="absolute inset-0">
                                    <div className="absolute top-4 left-4 w-20 h-20 rounded-2xl bg-violet-100/40 transform rotate-12" />
                                    <div className="absolute bottom-4 right-4 w-16 h-16 rounded-full bg-purple-100/40" />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-2xl bg-white shadow-lg flex items-center justify-center">
                                        <svg className="w-12 h-12 text-violet-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Badge */}
                                <div className="absolute top-3 right-3 bg-emerald-100 text-emerald-600 text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
                                    Popular
                                </div>
                            </div>

                            {/* Content */}
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors">
                                Single Job
                            </h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Create a dedicated landing page for one specific position with full job details and application form.
                            </p>

                            {/* Arrow indicator */}
                            <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-violet-100">
                                <svg className="w-4 h-4 text-violet-400 group-hover:text-violet-600 transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </div>
                        </div>
                    </button>

                    {/* Multi-Job Campaign */}
                    <button
                        onClick={onSelectMulti}
                        className="group relative text-left"
                    >
                        <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 transition-all duration-300 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-50 hover:-translate-y-1">
                            {/* Illustration */}
                            <div className="relative h-36 mb-5 rounded-xl bg-gradient-to-br from-purple-50/50 to-fuchsia-50/50 flex items-center justify-center overflow-hidden">
                                {/* Abstract shapes - multiple cards stacked */}
                                <div className="absolute inset-0">
                                    <div className="absolute top-6 left-6 w-14 h-14 rounded-xl bg-purple-100/40 transform -rotate-6" />
                                    <div className="absolute bottom-6 right-6 w-14 h-14 rounded-xl bg-fuchsia-100/40 transform rotate-6" />

                                    {/* Stacked cards */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                        <div className="absolute -left-3 -top-2 w-20 h-24 rounded-xl bg-violet-200/30 transform -rotate-6" />
                                        <div className="absolute left-0 top-0 w-20 h-24 rounded-xl bg-violet-100/50 transform rotate-3" />
                                        <div className="relative w-20 h-24 rounded-xl bg-white shadow-lg flex items-center justify-center">
                                            <svg className="w-10 h-10 text-violet-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* New Badge */}
                                <div className="absolute top-3 right-3 bg-violet-100 text-violet-600 text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                    </svg>
                                    New
                                </div>
                            </div>

                            {/* Content */}
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors">
                                Multi-Job Career Page
                            </h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Build a career page showcasing multiple positions. Perfect for employer branding.
                            </p>

                            {/* Arrow indicator */}
                            <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-violet-100">
                                <svg className="w-4 h-4 text-violet-400 group-hover:text-violet-600 transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Help text */}
                <div className="mt-8 flex items-start gap-3 p-4 rounded-xl bg-gray-50">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-gray-600">
                            <span className="font-medium text-gray-700">Not sure which to pick?</span>
                            {' '}Choose <span className="font-medium">Single Job</span> for dedicated role recruitment.
                            Use <span className="font-medium">Multi-Job</span> to showcase your company culture with all open positions.
                        </p>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default CampaignTypeSelector;
