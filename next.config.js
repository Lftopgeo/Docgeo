/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        domains: ['images.unsplash.com'],
    },
    // Adicionando configuração para melhorar a compatibilidade
    reactStrictMode: true,
    swcMinify: true,
};

module.exports = nextConfig;