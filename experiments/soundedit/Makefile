# --no-check-features
# I can't seem to pass
# "--features=atomics,bulk-memory", so I've disabled
# feature checking for now!

# --max-memory=13107200
# 200 pages of 65536 bytes
build-draw:
	clang \
		--target=wasm32 \
		--no-standard-libraries \
		-O3 \
		-fno-builtin \
		-fno-exceptions \
		-Wall \
		-Wl,--export-all \
		-Wl,--no-entry \
		-Wl,--allow-undefined \
		-Wl,--import-memory \
		-Wl,--max-memory=65536000 \
		-o draw.wasm \
		draw.c

# --max-memory=13107200
# 200 pages of 65536 bytes
build-sound:
	clang \
		--target=wasm32 \
		--no-standard-libraries \
		-O3 \
		-fno-builtin \
		-fno-exceptions \
		-Wall \
		-Wl,--export-all \
		-Wl,--no-entry \
		-Wl,--allow-undefined \
		-Wl,--import-memory \
		-Wl,--max-memory=65536000 \
		-o sound.wasm \
		sound.c
