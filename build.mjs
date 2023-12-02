import esbuild from "esbuild";
import * as dotenv from "dotenv";
import fs, { promises as fsPromises } from "fs";
import path from "path";

dotenv.config({ path: ".env" });

let files = [];
await readFiles("src", files);
// console.log(files)

let jsFiles = [];
await readJSFiles("src", jsFiles);
// console.log(jsFiles);

async function build_js_files() {
  await esbuild.build({
    entryPoints: jsFiles,
    bundle: true,
    outdir: process.env.OUTDIR,
    treeShaking: true,
    minify: true,
    legalComments: "none",
    define: {
      //   HOST: JSON.stringify(process.env.HOST),
    },
    loader: {},
    plugins: [],
  });
}

function build_manifest_json() {
  fs.readFile("src/manifest.json", function (err, data) {
    if (err) {
      throw new Error(err);
    }

    // console.log("异步读取文件数据: " + data.toString());

    [
      "APP_NAME",
      "VERSION",
      "APP_DESCRIPTION",
      "HOMEPAGE_URL",
      "UPDATE_URL",
    ].forEach(function (item, index, self) {
      data = data.toString().replace(new RegExp(item, "g"), process.env[item]);
    });

    fs.writeFile(`${process.env.OUTDIR}/manifest.json`, data, function (err) {
      if (err) {
        throw new Error(err);
      }
      // console.log("manifest.json 创建成功！");
    });
  });
}

async function delete_old_dir() {
  await fsPromises.rm(process.env.OUTDIR, { recursive: true, force: true });
}

async function copy_files(entryPoints, targetDir) {
  await Promise.all(
    entryPoints.map(async (entryPoint) => {
      const relativePath = path.relative("src", entryPoint);

      await fsPromises.mkdir(`${targetDir}/${path.dirname(relativePath)}`, {
        recursive: true,
      });

      await fsPromises.copyFile(entryPoint, `${targetDir}/${relativePath}`);
    })
  );
}

async function readFiles(dir, filesArray) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  files.forEach((file) => {
    const filePath = path.join(dir, file.name);

    if (file.isDirectory()) {
      readFiles(filePath, filesArray);
    } else if (file.isFile() && (path.extname(file.name) != ".vue") && (path.extname(file.name) != ".ts") && (path.extname(file.name) != ".html")) {
      filesArray.push(filePath);
    }
  });
}

async function readJSFiles(dir, filesArray) {
  const excludedFolders = ["libs", "icons"];

  const files = fs.readdirSync(dir, { withFileTypes: true });

  files.forEach((file) => {
    const filePath = path.join(dir, file.name);

    if (file.isDirectory()) {
      if (!excludedFolders.includes(file.name)) {
        readJSFiles(filePath, filesArray);
      }
    } else if (file.isFile() && path.extname(file.name) === ".js") {
      filesArray.push(filePath);
    }
  });
}

async function build() {
  await delete_old_dir();

  await copy_files(files, process.env.OUTDIR);

  // 要放到copy_files之后，OUTDIR 要先存在
  build_manifest_json();

  // 要放到copy_files之后，把 js 文件通过 ebuild 处理后覆盖
  await build_js_files();
}

console.log('start node build.mjs')
build();
console.log('node build.mjs success')
