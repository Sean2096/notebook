---
tags:
  - 速查卡
type: reference
domain: android
topic: 多设备
created: 2026-10-14
source: ""
---

# adb 多设备命令速查

## 核心结论
多设备场景下，**每条命令必须显式指定目标设备**，否则 adb 直接拒绝执行并报
`error: more than one device/emulator`。指定方式只有两种：`-s <serial>` 或 `ANDROID_SERIAL`。

## 序列号从哪来
```bash
adb devices -l        # 一定要加 -l，否则看不到 model/product
adb get-serialno      # 只有一台设备时可用
```
三类序列号都要支持，脚本里不能假设格式：

| 来源 | 形态 | 例子 |
| --- | --- | --- |
| USB 真机 | 厂商序列号 | `R58M60XXXX` |
| 模拟器 | `emulator-<端口>` | `emulator-5554` |
| 无线 | `IP:<端口>` | `192.168.1.10:5555` |

## 两种定向方式
```bash
# A. 每条命令带 -s —— 脚本里最安全，无残留状态
adb -s R58M60XXXX shell getprop ro.product.model

# B. 环境变量 —— 一段操作全打同一台
export ANDROID_SERIAL=R58M60XXXX
adb shell getprop ro.build.version.release
unset ANDROID_SERIAL      # 用完必须清，否则下一条命令打到错设备
```
`-s` 必须放在 `adb` 之后、子命令**之前**；`adb shell -s xxx` 是错的。

## 高频命令
```bash
adb -s $D shell getprop ro.product.cpu.abi     # 选对架构的 apk
adb -s $D install -r -g app.apk                # -r 保留数据覆盖装, -g 授予全部权限
adb -s $D uninstall com.example.app
adb -s $D shell pm list packages -3            # 只看第三方包
adb -s $D logcat -c && adb -s $D logcat -v time | grep -E 'AndroidRuntime|FATAL'
adb -s $D pull /sdcard/DCIM .
adb -s $D push build/app.apk /data/local/tmp/
adb -s $D shell screencap -p /sdcard/s.png
adb -s $D shell input tap 500 800
adb -s $D forward tcp:8080 tcp:8080
adb -s $D reboot
```

## 多设备专属的坑
- [ ] **端口转发按设备隔离**：两台设备不能转发同一个本地端口，否则 `address already in use`。
      用 `adb forward --list` 查现有映射再挑空闲端口。
- [ ] **无线调试（Android 11+）pair 端口 ≠ connect 端口**：
      ```bash
      adb pair 192.168.1.10:37123      # 设备端「无线调试 → 配对」里输 6 位码
      adb connect 192.168.1.10:40000   # 连接用另一个端口，且重启后会变
      ```
- [ ] **`unauthorized` → 去设备上手点「允许 USB 调试」；`offline` → 才需要重启 server**：
      ```bash
      adb kill-server && adb start-server
      ```
      `kill-server` 影响**所有**设备和你正在跑的 scrcpy / IDE 会话，是全局破坏性操作。
- [ ] **同一台设备 USB + 无线同时连接会以两个序列号出现两次**，看似两台机器。
      脚本里按型号去重，或固定只用一种连接方式。
- [ ] **`ANDROID_SERIAL` 会泄漏到后续 shell**：交互式用完记得 `unset`；脚本里改用局部变量或每次 `-s`。
- [ ] 多个 adb 进程共享同一个 adb server，并发安全；但长连接 `logcat` 各自占终端，
      批量抓取要后台跑并重定向到 `<serial>.log`。

## 批量对全部在线设备执行
```bash
#!/usr/bin/env bash
set -euo pipefail

# 只取状态为 device 的，过滤掉 offline / unauthorized
devices() {
  adb devices | awk 'NR>1 && $2=="device" {print $1}'
}

for d in $(devices); do
  echo "=== $d ==="
  adb -s "$d" shell getprop ro.build.version.release
  adb -s "$d" shell settings put global airplane_mode_on 1
done
```

## 关联
- 相关卡片：[[ ]]
- 项目实践：[[ ]]
