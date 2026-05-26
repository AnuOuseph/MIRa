from services.dsp.hrtf_kemar import load_kemar


def test_load_kemar_left_side():
    """
    90° should load correctly.
    """
    hrtf_l, hrtf_r = load_kemar(90.0, 0.0)

    assert hrtf_l is not None
    assert hrtf_r is not None

    assert hrtf_l.shape == (128,)
    assert hrtf_r.shape == (128,)


def test_load_kemar_right_side():
    """
    270° should load correctly
    and internally swap channels.
    """
    hrtf_l, hrtf_r = load_kemar(270.0, 0.0)

    assert hrtf_l is not None
    assert hrtf_r is not None

    assert hrtf_l.shape == (128,)
    assert hrtf_r.shape == (128,)


def test_multiple_angles():
    """
    Ensure common azimuths load without errors.
    """
    angles = [0, 45, 90, 135, 180, 225, 270, 315]

    for az in angles:
        hrtf_l, hrtf_r = load_kemar(float(az), 0.0)

        assert hrtf_l.shape == (128,)
        assert hrtf_r.shape == (128,)