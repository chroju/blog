title = sample

post:
	git checkout -b ${title}
	./scripts/generate-post.sh ${title}
	code ./posts/${title}.md
