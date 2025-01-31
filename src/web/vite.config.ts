import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    build: {
        chunkSizeWarningLimit: 1000,
    },
    preview: {
        port: 1234,
    },
    server: {
        port: 1234,
    },
    resolve: {
        dedupe: ['react', 'react-dom']
    },
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: "Polymedia Timezones",
                short_name: "Timezones",
                description: "The easiest way to keep track of time around the world.",
                start_url: "/",
                scope: "/",
                display: "fullscreen",
                background_color: "pink",
                theme_color: "black",
                icons: [
                    {
                        src: "/img/logo_1024x1024.webp",
                        type: "image/webp",
                        sizes: "1024x1024",
                        purpose: "any"
                    },
                    {
                        src: "/img/logo_1024x1024.webp",
                        type: "image/webp",
                        sizes: "1024x1024",
                        purpose: "maskable"
                    }
                ],
                screenshots: [
                    {
                        src: "/img/open-graph.webp",
                        type: "image/webp",
                        sizes: "2400x1200",
                        form_factor: "wide"
                    },
                    {
                        src: "/img/screenshot_1170x2532.webp",
                        type: "image/webp",
                        sizes: "1170x2532",
                        form_factor: "narrow"
                    }
                ]
            }
        })
    ],
});
