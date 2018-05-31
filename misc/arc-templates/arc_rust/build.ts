import * as gulp from "gulp";
import { Service, Arc, project, logLn } from "@wasm/studio-utils";

gulp.task("build", async () => {
    const options = { lto: true, opt_level: 's', debug: true };
    const data = await Service.compileFile(project.getFile("src/lib.rs"), "rust", "wasm", options);
    const outWasm = project.newFile("out/lib.wasm", "wasm", true);
    outWasm.setData(data);
});

gulp.task("publish", async () => {
    // Note: the Arch site interprets cols and rows inverted, so we switch them around
    // in the data we send.
    const rows = 36, cols = 44, frameCount = 1050, fps = 35;
    const { transform } = await (await Service.import('src/module.js')).default();
    const buffer = new ArrayBuffer(cols * rows * frameCount * 3);
    transform(buffer, rows, cols, frameCount, fps, true);
    const animation = Arc.animationBufferToJSON(buffer, cols, rows, frameCount);

    const jsModule = project.getFile("src/module.js").getData();
    const rsSource = project.getFile("src/lib.rs").getData();
    const wasmModule = project.getFile("out/lib.wasm").getData();
    Arc.publish({
        description: "WASM Module Example",
        author: "",
        animation: {
            rows: cols,
            cols: rows,
            frameCount,
            fps,
            data: animation,
        },
        entry: "src/module.js",
        files: {
            "src/module.js": jsModule,
            "src/lib.rs": rsSource,
            "out/lib.wasm": wasmModule,
        }
    });
    logLn("Rust Module was published.")
});

gulp.task("default", ["build"], async () => {});
