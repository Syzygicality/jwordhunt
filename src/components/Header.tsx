"use client";

import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const navigation = [
    { name: "Product", href: "#" },
    { name: "Features", href: "#" },
    { name: "Marketplace", href: "#" },
    { name: "Company", href: "#" },
];

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className='auto bg-amber-100'>
            <header className='absolute inset-x-0 top-0 z-50'>
                <nav
                    aria-label='Global'
                    className='flex items-center justify-between p-6 lg:px-8'
                >
                    <div className='flex lg:flex-1'>
                        <a href='#' className='-m-1.5 p-1.5'>
                            <span className='sr-only'>Your Company</span>
                            <img
                                alt=''
                                src='https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500'
                                className='h-8 w-auto'
                            />
                        </a>
                    </div>
                    <div className='flex lg:hidden'>
                        <button
                            type='button'
                            onClick={() => setMobileMenuOpen(true)}
                            className='-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-200'
                        >
                            <span className='sr-only'>Open main menu</span>
                            <Bars3Icon aria-hidden='true' className='size-6' />
                        </button>
                    </div>
                    <div className='hidden lg:flex lg:gap-x-12'>
                        {navigation.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className='text-sm/6 font-semibold text-stone-800'
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>
                    <div className='hidden lg:flex lg:flex-1 lg:justify-end'>
                        <Link
                            to='/login'
                            className='text-sm/6 font-semibold text-stone-800'
                        >
                            Log in <span aria-hidden='true'>&rarr;</span>
                        </Link>
                    </div>
                </nav>
                <Dialog
                    open={mobileMenuOpen}
                    onClose={setMobileMenuOpen}
                    className='lg:hidden'
                >
                    <div className='fixed inset-0 z-50' />
                    <DialogPanel className='fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-amber-100 p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10'>
                        <div className='flex items-center justify-between'>
                            <a href='#' className='-m-1.5 p-1.5'>
                                <span className='sr-only'>Your Company</span>
                                <img
                                    alt=''
                                    src='https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500'
                                    className='h-8 w-auto'
                                />
                            </a>
                            <button
                                type='button'
                                onClick={() => setMobileMenuOpen(false)}
                                className='-m-2.5 rounded-md p-2.5 text-gray-200'
                            >
                                <span className='sr-only'>Close menu</span>
                                <XMarkIcon
                                    aria-hidden='true'
                                    className='size-6'
                                />
                            </button>
                        </div>
                        <div className='mt-6 flow-root'>
                            <div className='-my-6 divide-y divide-white/10'>
                                <div className='space-y-2 py-6'>
                                    {navigation.map((item) => (
                                        <a
                                            key={item.name}
                                            href={item.href}
                                            className='-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-stone-800 hover:bg-white/5'
                                        >
                                            {item.name}
                                        </a>
                                    ))}
                                </div>
                                <div className='py-6'>
                                    <a
                                        href='#'
                                        className='-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-stone-800 hover:bg-white/5'
                                    >
                                        Log in
                                    </a>
                                </div>
                            </div>
                        </div>
                    </DialogPanel>
                </Dialog>
            </header>

            <div className='relative isolate px-6 pt-14 lg:px-8'>
                <div className='mx-auto max-w-2xl py-32 sm:py-48 lg:py-56'>
                    <div className='text-center'>
                        <h1 className='font-display text-5xl font-semibold tracking-tight text-balance text-stone-900 sm:text-7xl'>
                            Your Personalized AI Therapist
                        </h1>
                        <p className='mt-8 text-lg font-medium text-pretty text-stone-900 sm:text-xl/8'>
                            Experience readily available support and guidance with a 24/7 AI therapist.
                        </p>
                        <div className='mt-10 flex items-center justify-center gap-x-6'>
                            <Link
                                to='/register'
                                className='rounded-md bg-stone-800 px-4 py-3 text-sm font-semibold text-white shadow-xs hover:bg-stone-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'
                            >
                                Get started
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}
