ISCSI
=====

```bash
# ISCSI_TARGET_PORTAL=172.17.247.210
# sudo iscsiadm -m discovery -t st -p "${ISCSI_TARGET_PORTAL}"
# ISCSI_TARGET_NAME=iqn.1992-04.com.emc:cx.ckm00142002019.b4
# sudo iscsiadm --mode node --targetname "${ISCSI_TARGET_NAME}" -p "${ISCSI_TARGET_PORTAL}" -l
# dmesg | grep sd
```
