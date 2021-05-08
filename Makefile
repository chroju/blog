title = sample

post:
	git checkout -b ${title}
	./scripts/generate-post.sh ${title}
	code ./posts/${title}.md
	open http://localhost:3000/blog/${title}
	npm run dev
