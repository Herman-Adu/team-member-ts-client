const fs = require("fs-extra");

/* interface CopyFolderProps {
  source: string;
  target: string;
} */

/*   type CopyFolderProps = {
    source: string;
    target: string;
  } */

async function copyFolder(source: string, target: string) {
  //async function copyFolder(source, target) {
  try {
    await fs.remove(target);
    await fs.copy(source, target);
  } catch (error) {
    console.log(error);
  }
}

const sourceDir =
  "C:/Users/herma/source/repository/strapi-5-next-blog-post-main/server/public/uploads";
const targetDir =
  "C:/Users/herma/source/repository/strapi-5-next-blog-post-main/client/public/uploads";

copyFolder(sourceDir, targetDir);
