build:
	clang \
		--target=wasm32 \
		--no-standard-libraries \
		-O2 \
		-fno-builtin \
		-fno-exceptions \
		-Wall \
		-Wl,--export-all \
		-Wl,--no-entry \
		-Wl,--allow-undefined \
		-Wl,--import-memory \
		-Wl,--max-memory=13107200 \
		-o dist/main.wasm \
		src/main.c
