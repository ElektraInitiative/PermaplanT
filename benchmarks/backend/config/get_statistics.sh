#!/usr/bin/env nu

cd backend

print "Requests:"
grep 'Total: connections ' httperf.log | awk '{print "total:", $3}'
grep 'Connection time \[ms\]: min' httperf.log | awk '{print "min:", $5, "ms\navg:", $7, "ms\nmax:", $9, "ms"}'
