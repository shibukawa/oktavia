build release_node release_web:

release_web:
	jsx --release

release_node:
	jsx --release

test: test_bit_vector test_wavelet_matrix test_fm_index test_burrows_wheeler_transform

test_bit_vector:
	jsx --add-search-path ./lib --test ./test/test_bit_vector.jsx

test_wavelet_matrix:
	jsx --add-search-path ./lib --test ./test/test_wavelet_matrix.jsx

test_fm_index:
	jsx --add-search-path ./lib --test ./test/test_fm_index.jsx

test_burrows_wheeler_transform:
	jsx --add-search-path ./lib --test ./test/test_burrows_wheeler_transform.jsx
