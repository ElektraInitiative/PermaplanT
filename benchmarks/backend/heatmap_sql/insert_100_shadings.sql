DELETE FROM public.shadings WHERE layer_id = 3;
INSERT INTO public.shadings (id, layer_id, geometry, shade, add_date, remove_date) VALUES
(
    'e6622aab-dc5d-4865-89d2-000000000000',
    3,
    st_geomfromtext('POLYGON((0 0, 100 0, 100 100, 0 100, 0 0))'),
    'light shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000001',
    3,
    st_geomfromtext('POLYGON((150 0, 250 0, 250 100, 150 100, 150 0))'),
    'partial shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000002',
    3,
    st_geomfromtext('POLYGON((300 0, 400 0, 400 100, 300 100, 300 0))'),
    'permanent shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000003',
    3,
    st_geomfromtext('POLYGON((450 0, 550 0, 550 100, 450 100, 450 0))'),
    'permanent deep shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000004',
    3,
    st_geomfromtext('POLYGON((600 0, 700 0, 700 100, 600 100, 600 0))'),
    'light shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000005',
    3,
    st_geomfromtext('POLYGON((750 0, 850 0, 850 100, 750 100, 750 0))'),
    'partial shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000006',
    3,
    st_geomfromtext('POLYGON((900 0, 1000 0, 1000 100, 900 100, 900 0))'),
    'permanent shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000007',
    3,
    st_geomfromtext('POLYGON((1050 0, 1150 0, 1150 100, 1050 100, 1050 0))'),
    'permanent deep shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000008',
    3,
    st_geomfromtext('POLYGON((1200 0, 1300 0, 1300 100, 1200 100, 1200 0))'),
    'light shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000009',
    3,
    st_geomfromtext('POLYGON((1350 0, 1450 0, 1450 100, 1350 100, 1350 0))'),
    'partial shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000010',
    3,
    st_geomfromtext('POLYGON((1500 0, 1600 0, 1600 100, 1500 100, 1500 0))'),
    'permanent shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000011',
    3,
    st_geomfromtext('POLYGON((1650 0, 1750 0, 1750 100, 1650 100, 1650 0))'),
    'permanent deep shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000012',
    3,
    st_geomfromtext('POLYGON((1800 0, 1900 0, 1900 100, 1800 100, 1800 0))'),
    'light shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000013',
    3,
    st_geomfromtext('POLYGON((1950 0, 2050 0, 2050 100, 1950 100, 1950 0))'),
    'partial shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000014',
    3,
    st_geomfromtext('POLYGON((2100 0, 2200 0, 2200 100, 2100 100, 2100 0))'),
    'permanent shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000015',
    3,
    st_geomfromtext('POLYGON((2250 0, 2350 0, 2350 100, 2250 100, 2250 0))'),
    'permanent deep shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000016',
    3,
    st_geomfromtext('POLYGON((2400 0, 2500 0, 2500 100, 2400 100, 2400 0))'),
    'light shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000017',
    3,
    st_geomfromtext('POLYGON((2550 0, 2650 0, 2650 100, 2550 100, 2550 0))'),
    'partial shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000018',
    3,
    st_geomfromtext('POLYGON((2700 0, 2800 0, 2800 100, 2700 100, 2700 0))'),
    'permanent shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000019',
    3,
    st_geomfromtext('POLYGON((2850 0, 2950 0, 2950 100, 2850 100, 2850 0))'),
    'permanent deep shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000020',
    3,
    st_geomfromtext('POLYGON((3000 0, 3100 0, 3100 100, 3000 100, 3000 0))'),
    'light shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000021',
    3,
    st_geomfromtext('POLYGON((3150 0, 3250 0, 3250 100, 3150 100, 3150 0))'),
    'partial shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000022',
    3,
    st_geomfromtext('POLYGON((3300 0, 3400 0, 3400 100, 3300 100, 3300 0))'),
    'permanent shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000023',
    3,
    st_geomfromtext('POLYGON((3450 0, 3550 0, 3550 100, 3450 100, 3450 0))'),
    'permanent deep shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000024',
    3,
    st_geomfromtext('POLYGON((3600 0, 3700 0, 3700 100, 3600 100, 3600 0))'),
    'light shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000025',
    3,
    st_geomfromtext('POLYGON((3750 0, 3850 0, 3850 100, 3750 100, 3750 0))'),
    'partial shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000026',
    3,
    st_geomfromtext('POLYGON((3900 0, 4000 0, 4000 100, 3900 100, 3900 0))'),
    'permanent shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000027',
    3,
    st_geomfromtext('POLYGON((4050 0, 4150 0, 4150 100, 4050 100, 4050 0))'),
    'permanent deep shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000028',
    3,
    st_geomfromtext('POLYGON((4200 0, 4300 0, 4300 100, 4200 100, 4200 0))'),
    'light shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000029',
    3,
    st_geomfromtext('POLYGON((4350 0, 4450 0, 4450 100, 4350 100, 4350 0))'),
    'partial shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000030',
    3,
    st_geomfromtext('POLYGON((4500 0, 4600 0, 4600 100, 4500 100, 4500 0))'),
    'permanent shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000031',
    3,
    st_geomfromtext('POLYGON((4650 0, 4750 0, 4750 100, 4650 100, 4650 0))'),
    'permanent deep shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000032',
    3,
    st_geomfromtext('POLYGON((4800 0, 4900 0, 4900 100, 4800 100, 4800 0))'),
    'light shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000033',
    3,
    st_geomfromtext('POLYGON((4950 0, 5050 0, 5050 100, 4950 100, 4950 0))'),
    'partial shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000034',
    3,
    st_geomfromtext('POLYGON((5100 0, 5200 0, 5200 100, 5100 100, 5100 0))'),
    'permanent shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000035',
    3,
    st_geomfromtext('POLYGON((5250 0, 5350 0, 5350 100, 5250 100, 5250 0))'),
    'permanent deep shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000036',
    3,
    st_geomfromtext('POLYGON((5400 0, 5500 0, 5500 100, 5400 100, 5400 0))'),
    'light shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000037',
    3,
    st_geomfromtext('POLYGON((5550 0, 5650 0, 5650 100, 5550 100, 5550 0))'),
    'partial shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000038',
    3,
    st_geomfromtext('POLYGON((5700 0, 5800 0, 5800 100, 5700 100, 5700 0))'),
    'permanent shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000039',
    3,
    st_geomfromtext('POLYGON((5850 0, 5950 0, 5950 100, 5850 100, 5850 0))'),
    'permanent deep shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000040',
    3,
    st_geomfromtext('POLYGON((6000 0, 6100 0, 6100 100, 6000 100, 6000 0))'),
    'light shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000041',
    3,
    st_geomfromtext('POLYGON((6150 0, 6250 0, 6250 100, 6150 100, 6150 0))'),
    'partial shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000042',
    3,
    st_geomfromtext('POLYGON((6300 0, 6400 0, 6400 100, 6300 100, 6300 0))'),
    'permanent shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000043',
    3,
    st_geomfromtext('POLYGON((6450 0, 6550 0, 6550 100, 6450 100, 6450 0))'),
    'permanent deep shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000044',
    3,
    st_geomfromtext('POLYGON((6600 0, 6700 0, 6700 100, 6600 100, 6600 0))'),
    'light shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000045',
    3,
    st_geomfromtext('POLYGON((6750 0, 6850 0, 6850 100, 6750 100, 6750 0))'),
    'partial shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000046',
    3,
    st_geomfromtext('POLYGON((6900 0, 7000 0, 7000 100, 6900 100, 6900 0))'),
    'permanent shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000047',
    3,
    st_geomfromtext('POLYGON((7050 0, 7150 0, 7150 100, 7050 100, 7050 0))'),
    'permanent deep shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000048',
    3,
    st_geomfromtext('POLYGON((7200 0, 7300 0, 7300 100, 7200 100, 7200 0))'),
    'light shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000049',
    3,
    st_geomfromtext('POLYGON((7350 0, 7450 0, 7450 100, 7350 100, 7350 0))'),
    'partial shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000050',
    3,
    st_geomfromtext('POLYGON((7500 0, 7600 0, 7600 100, 7500 100, 7500 0))'),
    'permanent shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000051',
    3,
    st_geomfromtext('POLYGON((7650 0, 7750 0, 7750 100, 7650 100, 7650 0))'),
    'permanent deep shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000052',
    3,
    st_geomfromtext('POLYGON((7800 0, 7900 0, 7900 100, 7800 100, 7800 0))'),
    'light shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000053',
    3,
    st_geomfromtext('POLYGON((7950 0, 8050 0, 8050 100, 7950 100, 7950 0))'),
    'partial shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000054',
    3,
    st_geomfromtext('POLYGON((8100 0, 8200 0, 8200 100, 8100 100, 8100 0))'),
    'permanent shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000055',
    3,
    st_geomfromtext('POLYGON((8250 0, 8350 0, 8350 100, 8250 100, 8250 0))'),
    'permanent deep shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000056',
    3,
    st_geomfromtext('POLYGON((8400 0, 8500 0, 8500 100, 8400 100, 8400 0))'),
    'light shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000057',
    3,
    st_geomfromtext('POLYGON((8550 0, 8650 0, 8650 100, 8550 100, 8550 0))'),
    'partial shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000058',
    3,
    st_geomfromtext('POLYGON((8700 0, 8800 0, 8800 100, 8700 100, 8700 0))'),
    'permanent shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000059',
    3,
    st_geomfromtext('POLYGON((8850 0, 8950 0, 8950 100, 8850 100, 8850 0))'),
    'permanent deep shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000060',
    3,
    st_geomfromtext('POLYGON((9000 0, 9100 0, 9100 100, 9000 100, 9000 0))'),
    'light shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000061',
    3,
    st_geomfromtext('POLYGON((9150 0, 9250 0, 9250 100, 9150 100, 9150 0))'),
    'partial shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000062',
    3,
    st_geomfromtext('POLYGON((9300 0, 9400 0, 9400 100, 9300 100, 9300 0))'),
    'permanent shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000063',
    3,
    st_geomfromtext('POLYGON((9450 0, 9550 0, 9550 100, 9450 100, 9450 0))'),
    'permanent deep shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000064',
    3,
    st_geomfromtext('POLYGON((9600 0, 9700 0, 9700 100, 9600 100, 9600 0))'),
    'light shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000065',
    3,
    st_geomfromtext('POLYGON((9750 0, 9850 0, 9850 100, 9750 100, 9750 0))'),
    'partial shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000066',
    3,
    st_geomfromtext('POLYGON((0 150, 100 150, 100 250, 0 250, 0 150))'),
    'permanent shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000067',
    3,
    st_geomfromtext('POLYGON((150 150, 250 150, 250 250, 150 250, 150 150))'),
    'permanent deep shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000068',
    3,
    st_geomfromtext('POLYGON((300 150, 400 150, 400 250, 300 250, 300 150))'),
    'light shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000069',
    3,
    st_geomfromtext('POLYGON((450 150, 550 150, 550 250, 450 250, 450 150))'),
    'partial shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000070',
    3,
    st_geomfromtext('POLYGON((600 150, 700 150, 700 250, 600 250, 600 150))'),
    'permanent shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000071',
    3,
    st_geomfromtext('POLYGON((750 150, 850 150, 850 250, 750 250, 750 150))'),
    'permanent deep shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000072',
    3,
    st_geomfromtext('POLYGON((900 150, 1000 150, 1000 250, 900 250, 900 150))'),
    'light shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000073',
    3,
    st_geomfromtext('POLYGON((1050 150, 1150 150, 1150 250, 1050 250, 1050 150))'),
    'partial shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000074',
    3,
    st_geomfromtext('POLYGON((1200 150, 1300 150, 1300 250, 1200 250, 1200 150))'),
    'permanent shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000075',
    3,
    st_geomfromtext('POLYGON((1350 150, 1450 150, 1450 250, 1350 250, 1350 150))'),
    'permanent deep shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000076',
    3,
    st_geomfromtext('POLYGON((1500 150, 1600 150, 1600 250, 1500 250, 1500 150))'),
    'light shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000077',
    3,
    st_geomfromtext('POLYGON((1650 150, 1750 150, 1750 250, 1650 250, 1650 150))'),
    'partial shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000078',
    3,
    st_geomfromtext('POLYGON((1800 150, 1900 150, 1900 250, 1800 250, 1800 150))'),
    'permanent shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000079',
    3,
    st_geomfromtext('POLYGON((1950 150, 2050 150, 2050 250, 1950 250, 1950 150))'),
    'permanent deep shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000080',
    3,
    st_geomfromtext('POLYGON((2100 150, 2200 150, 2200 250, 2100 250, 2100 150))'),
    'light shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000081',
    3,
    st_geomfromtext('POLYGON((2250 150, 2350 150, 2350 250, 2250 250, 2250 150))'),
    'partial shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000082',
    3,
    st_geomfromtext('POLYGON((2400 150, 2500 150, 2500 250, 2400 250, 2400 150))'),
    'permanent shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000083',
    3,
    st_geomfromtext('POLYGON((2550 150, 2650 150, 2650 250, 2550 250, 2550 150))'),
    'permanent deep shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000084',
    3,
    st_geomfromtext('POLYGON((2700 150, 2800 150, 2800 250, 2700 250, 2700 150))'),
    'light shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000085',
    3,
    st_geomfromtext('POLYGON((2850 150, 2950 150, 2950 250, 2850 250, 2850 150))'),
    'partial shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000086',
    3,
    st_geomfromtext('POLYGON((3000 150, 3100 150, 3100 250, 3000 250, 3000 150))'),
    'permanent shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000087',
    3,
    st_geomfromtext('POLYGON((3150 150, 3250 150, 3250 250, 3150 250, 3150 150))'),
    'permanent deep shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000088',
    3,
    st_geomfromtext('POLYGON((3300 150, 3400 150, 3400 250, 3300 250, 3300 150))'),
    'light shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000089',
    3,
    st_geomfromtext('POLYGON((3450 150, 3550 150, 3550 250, 3450 250, 3450 150))'),
    'partial shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000090',
    3,
    st_geomfromtext('POLYGON((3600 150, 3700 150, 3700 250, 3600 250, 3600 150))'),
    'permanent shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000091',
    3,
    st_geomfromtext('POLYGON((3750 150, 3850 150, 3850 250, 3750 250, 3750 150))'),
    'permanent deep shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000092',
    3,
    st_geomfromtext('POLYGON((3900 150, 4000 150, 4000 250, 3900 250, 3900 150))'),
    'light shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000093',
    3,
    st_geomfromtext('POLYGON((4050 150, 4150 150, 4150 250, 4050 250, 4050 150))'),
    'partial shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000094',
    3,
    st_geomfromtext('POLYGON((4200 150, 4300 150, 4300 250, 4200 250, 4200 150))'),
    'permanent shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000095',
    3,
    st_geomfromtext('POLYGON((4350 150, 4450 150, 4450 250, 4350 250, 4350 150))'),
    'permanent deep shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000096',
    3,
    st_geomfromtext('POLYGON((4500 150, 4600 150, 4600 250, 4500 250, 4500 150))'),
    'light shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000097',
    3,
    st_geomfromtext('POLYGON((4650 150, 4750 150, 4750 250, 4650 250, 4650 150))'),
    'partial shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000098',
    3,
    st_geomfromtext('POLYGON((4800 150, 4900 150, 4900 250, 4800 250, 4800 150))'),
    'permanent shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000099',
    3,
    st_geomfromtext('POLYGON((4950 150, 5050 150, 5050 250, 4950 250, 4950 150))'),
    'permanent deep shade',
    null,
    null
);
