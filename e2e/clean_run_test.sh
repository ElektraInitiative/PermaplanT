python3 clean_db.py
python3 -m pytest steps/test_undo_redo.py -n auto --reruns 2 --reruns-delay 5 --rerun-except AssertionError --video on
