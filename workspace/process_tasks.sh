#!/bin/bash

# Process all tasks, ensuring logs persist independently
cd /home/claw/.openclaw/workspace/coding
if [ ! -f processed.log ]; then touch processed.log; fi
for task in *; do
  if [[ $task == *.py ]]; then
    python3 $task >> log.txt
    echo "Processed Python File: $task" | tee -a processed.log
    cp $task ../qa/$task
  elif [[ $task == *.txt ]]; then
    echo "Processing Coding Task: $(cat $task)" | tee -a processed.log
    cp $task ../qa/$task
  fi
done

cd /home/claw/.openclaw/workspace/qa
if [ ! -f processed.log ]; then touch processed.log; fi
for task in *; do
  if [[ $task == *.py ]]; then
    python3 $task >> log.txt
    echo "Processed Python File: $task" | tee -a processed.log
  elif [[ $task == *.txt ]]; then
    echo "Processing QA Task: $(cat $task)" | tee -a processed.log
  fi
done
