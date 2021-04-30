---
title: "iOS"
description: "iOS tips"
date: 04/05/2021
categories:
 - Smartphone
tags:
 - iOS
 - apple
---


### Network monitoring

From [@RandoriSec](https://twitter.com/RandoriSec/status/1389115276931833857) :

Easy network monitoring even on non-jailbroken iOS:
1. connect your iOS device to your macOS via USB
2. `rvictl -s <UDID>`
3. `tcpdump` or `wireshark -i rvi0`

On Windows or Linux, you can use [rvi_capture](https://github.com/gh2o/rvi_capture)
