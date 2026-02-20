Topic: Basics of Kubernetes ConfigMaps

- **Concept:** Learn how ConfigMaps in Kubernetes allow you to inject configuration data into applications without hardcoding it.
- **Why it matters:** ConfigMaps help you make your app environment-agnostic, focusing on reusable templates.
- **Micro-exercise:**
  1. Create a simple ConfigMap `my-config` in Kubernetes containing a pair of key-value configurations.
     ```yaml
     apiVersion: v1
     kind: ConfigMap
     metadata:
       name: my-config
     data:
       key1: value1
       key2: value2
     ```
  2. Deploy a Pod using this ConfigMap to configure a dummy NGINX container.
     ```yaml
     apiVersion: v1
     kind: Pod
     metadata:
       name: test-pod
     spec:
       containers:
       - name: nginx
         image: nginx
         envFrom:
         - configMapRef:
             name: my-config
     ```
  3. Use `kubectl describe pod test-pod` to verify environment variables are correctly populated.

**Links:**
1. [Kubernetes ConfigMap Overview](https://kubernetes.io/docs/concepts/configuration/configmap/)
2. [Practice Exercise on ConfigMaps](https://kubernetesbyexample.com/other/exercise)
