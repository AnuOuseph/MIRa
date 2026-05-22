import numpy as np
from services.dsp.hrtf import make_hrtf, HRTF_LEN

def test_hrtf_shape():
    left, right = make_hrtf(90.0, 0.0)

    assert left.shape == (HRTF_LEN,)
    assert right.shape == (HRTF_LEN,)
    assert left.dtype == np.float32
    assert right.dtype == np.float32

def test_front_is_symmetric():
    left, right = make_hrtf(0.0, 0.0)

    assert np.allclose(left, right, atol=1e-5)

def test_left_source_is_asymmetric():
    left, right = make_hrtf(90.0, 0.0)

    assert not np.allclose(left, right)