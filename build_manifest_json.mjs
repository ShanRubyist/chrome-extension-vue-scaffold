import esbuild from "esbuild";
import * as dotenv from "dotenv";
import fs, { promises as fsPromises } from "fs";
import path from "path";

dotenv.config({ path: ".env" });

function build_manifest_json() {
  fs.readFile(process.env.MANIFEST, function (err, data) {
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

build_manifest_json();

console.log('node build.mjs success')
