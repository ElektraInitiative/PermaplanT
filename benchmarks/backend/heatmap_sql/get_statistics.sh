#!/usr/bin/env nu

cd backend

grep ' UTC \[[0-9]*\] ' postgis.log | lines | split column -r '\[|\]' | group-by column2 | values | each {|pid| $pid | each {|el| $"($el.column1)[($el.column2)]($el.column3)" } } | flatten | save -f postgis_parsed.log

print "SQL queries:"
grep 'LOG:  execute s.*: SELECT \* FROM calculate_heatmap' postgis_parsed.log -A 2
    | grep 'LOG:  duration: .* ms$'
    | awk 'NR == 1 {count=1; sum=$7; min=$7; max=$7}
           NR > 1  {count++; sum+=$7; if ($7<0+min) min=$7; if ($7>0+max) max=$7}
           END {print "total:", count, "\nmin:", min, "ms\navg:", sum/count, "ms\nmax:", max, "ms"}'

print ""

print "Requests:"
grep 'Total: connections ' httperf.log | awk '{print "total:", $3}'
grep 'Connection time \[ms\]: min' httperf.log | awk '{print "min:", $5, "ms\navg:", $7, "ms\nmax:", $9, "ms"}'
