const casual = require("casual").functions();
const fs = require("fs");

function generatePosts(amount) {
  const posts = [];
  Array.from(new Array(amount)).forEach(() => {
    posts.push({
      id: casual.uuid(),
      title: casual.title(),
      author: casual.full_name(),
      description: casual.text() + casual.text(),
      imageUrl: `https://picsum.photos/id/${casual.integer(
        (from = 1),
        (to = 800)
      )}/1368/400`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  });
  return posts;
}

(() => {
  const db = {
    posts: generatePosts(50),
  };
  fs.writeFile("db.json", JSON.stringify(db), () =>
    console.log("generate successful")
  );
})();
