#!/usr/bin/env bash

if [ -z "$GETH_PATH" ]; then
    GETH_PATH='./geth'
fi

DATA_PATH="$GETH_PATH/data"

PUBLIC_KEY=$(cat "$GETH_PATH/etherbase.txt")
geth --datadir "$DATA_PATH" --networkid 1547 --http --http.corsdomain '*' --http.api 'admin,personal,eth,net,web3,txpool,miner' --allow-insecure-unlock --unlock "$PUBLIC_KEY" --password "$GETH_PATH/pass.txt" --mine --snapshot=false --miner.etherbase "$PUBLIC_KEY"
