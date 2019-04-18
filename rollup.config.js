import babel from 'rollup-plugin-babel';
// import eslint from 'rollup-plugin-eslint';
// import resolve from 'rollup-plugin-node-resolve';
// import multiEntry from 'rollup-plugin-multi-entry';
import uglify from 'rollup-plugin-uglify';
import filesize from 'rollup-plugin-filesize';
// import commonjs from 'rollup-plugin-commonjs';
import progress from 'rollup-plugin-progress';

export default [{
    input: './src/js/scroll-window-to-element.js',
    output: {
        name: 'main', // for external calls (need exports)
        file: 'dist/index.min.js',
        format: 'umd',
    },
    plugins: [
        // commonjs(),
        // eslint(),
        progress(),
        babel({
            exclude: 'node_modules/**',
        }),
        // uglify(),
        filesize({
            showGzippedSize: false,
        })
    ],
}];