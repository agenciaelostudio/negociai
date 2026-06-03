/**
 * Workaround para o bug do Next.js no Windows ao buildar em drives diferentes de C:.
 * Ref: https://github.com/vercel/next.js/issues/45067
 *
 * Durante o "build trace", o Next chama fs.readlink em arquivos que não são
 * symlinks. No Windows (drives != C:) o Node lança EISDIR, que os wrappers do
 * Next não tratavam (só tratavam EINVAL/ENOENT/UNKNOWN). Aqui convertemos
 * EISDIR -> EINVAL para que o Next interprete como "não é um symlink".
 *
 * Pré-carregado via: node -r ./scripts/patch-eisdir.cjs ...
 */
const fs = require("fs");

function rewrite(err) {
  if (err && err.code === "EISDIR") {
    err.code = "EINVAL";
  }
  return err;
}

const origSync = fs.readlinkSync;
fs.readlinkSync = function patchedReadlinkSync(...args) {
  try {
    return origSync.apply(this, args);
  } catch (e) {
    throw rewrite(e);
  }
};

const origCb = fs.readlink;
fs.readlink = function patchedReadlink(...args) {
  const cb = args[args.length - 1];
  if (typeof cb === "function") {
    args[args.length - 1] = function (err, ...rest) {
      cb(err ? rewrite(err) : err, ...rest);
    };
  }
  return origCb.apply(this, args);
};

if (fs.promises && fs.promises.readlink) {
  const origProm = fs.promises.readlink;
  fs.promises.readlink = function patchedPromiseReadlink(...args) {
    return origProm.apply(this, args).catch((e) => {
      throw rewrite(e);
    });
  };
}
