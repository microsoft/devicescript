// auto-generated!
#include "devs_internal.h"

#define PROP DEVS_BUILTIN_FLAG_IS_PROPERTY
#define ASYNC DEVS_BUILTIN_FLAG_ASYNC_CALL
#define NO_SELF DEVS_BUILTIN_FLAG_NO_SELF
#define CTOR DEVS_BUILTIN_FLAG_IS_CTOR

#define N(n) (DEVS_BUILTIN_STRING_##n)

// impl_array.c
value_t prop_Array_length(devs_ctx_t *ctx, value_t self);
void meth2_Array_insert(devs_ctx_t *ctx);
void fun1_Array_isArray(devs_ctx_t *ctx);
void methX_Array_push(devs_ctx_t *ctx);
void meth1_Array_pushRange(devs_ctx_t *ctx);
void methX_Array_slice(devs_ctx_t *ctx);
void meth1_Array_join(devs_ctx_t *ctx);
// impl_buffer.c
void fun1_Buffer_alloc(devs_ctx_t *ctx);
void fun1_Buffer_from(devs_ctx_t *ctx);
value_t prop_Buffer_length(devs_ctx_t *ctx, value_t self);
void meth1_Buffer_toString(devs_ctx_t *ctx);
void meth3_Buffer_fillAt(devs_ctx_t *ctx);
void meth4_Buffer_blitAt(devs_ctx_t *ctx);
// impl_ds.c
void fun1_DeviceScript_sleep(devs_ctx_t *ctx);
void fun1_DeviceScript_delay(devs_ctx_t *ctx);
void fun1_DeviceScript__panic(devs_ctx_t *ctx);
void fun0_DeviceScript_reboot(devs_ctx_t *ctx);
void fun0_DeviceScript_restart(devs_ctx_t *ctx);
void funX_DeviceScript_format(devs_ctx_t *ctx);
void fun2_DeviceScript_print(devs_ctx_t *ctx);
void fun1_DeviceScript_parseFloat(devs_ctx_t *ctx);
void fun1_DeviceScript_parseInt(devs_ctx_t *ctx);
void fun2_DeviceScript__logRepr(devs_ctx_t *ctx);
void fun1_DeviceScript__dcfgString(devs_ctx_t *ctx);
void fun0_DeviceScript_millis(devs_ctx_t *ctx);
void fun1_DeviceScript_deviceIdentifier(devs_ctx_t *ctx);
void fun2_DeviceScript__serverSend(devs_ctx_t *ctx);
void fun2_DeviceScript__allocRole(devs_ctx_t *ctx);
// impl_dsspi.c
void fun5_DeviceScript_spiConfigure(devs_ctx_t *ctx);
void fun2_DeviceScript_spiXfer(devs_ctx_t *ctx);
// impl_error.c
void meth1_Error___ctor__(devs_ctx_t *ctx);
void meth1_RangeError___ctor__(devs_ctx_t *ctx);
void meth1_TypeError___ctor__(devs_ctx_t *ctx);
void meth1_SyntaxError___ctor__(devs_ctx_t *ctx);
value_t prop_Error_name(devs_ctx_t *ctx, value_t self);
void meth0_Error_print(devs_ctx_t *ctx);
// impl_fiber.c
value_t prop_DsFiber_id(devs_ctx_t *ctx, value_t self);
value_t prop_DsFiber_suspended(devs_ctx_t *ctx, value_t self);
void meth1_DsFiber_resume(devs_ctx_t *ctx);
void meth0_DsFiber_terminate(devs_ctx_t *ctx);
void fun1_DeviceScript_suspend(devs_ctx_t *ctx);
void fun0_DsFiber_self(devs_ctx_t *ctx);
// impl_function.c
void methX_Function_start(devs_ctx_t *ctx);
value_t prop_Function_prototype(devs_ctx_t *ctx, value_t self);
value_t prop_Function_name(devs_ctx_t *ctx, value_t self);
// impl_image.c
value_t prop_Image_width(devs_ctx_t *ctx, value_t self);
value_t prop_Image_height(devs_ctx_t *ctx, value_t self);
value_t prop_Image_bpp(devs_ctx_t *ctx, value_t self);
void fun5_Image_alloc(devs_ctx_t *ctx);
void meth3_Image_set(devs_ctx_t *ctx);
void meth2_Image_get(devs_ctx_t *ctx);
void meth1_Image_fill(devs_ctx_t *ctx);
void meth5_Image_fillRect(devs_ctx_t *ctx);
void meth1_Image_equals(devs_ctx_t *ctx);
void meth0_Image_clone(devs_ctx_t *ctx);
void meth0_Image_flipX(devs_ctx_t *ctx);
void meth0_Image_flipY(devs_ctx_t *ctx);
void meth0_Image_transposed(devs_ctx_t *ctx);
void meth3_Image_drawImage(devs_ctx_t *ctx);
void meth4_Image_drawTransparentImage(devs_ctx_t *ctx);
void meth3_Image_overlapsWith(devs_ctx_t *ctx);
void meth5_Image_drawLine(devs_ctx_t *ctx);
void meth5_Image_blitRow(devs_ctx_t *ctx);
void meth11_Image_blit(devs_ctx_t *ctx);
void meth4_Image_fillCircle(devs_ctx_t *ctx);
// impl_json.c
void fun2_JSON_parse(devs_ctx_t *ctx);
void fun3_JSON_stringify(devs_ctx_t *ctx);
// impl_math.c
void fun1_Math_ceil(devs_ctx_t *ctx);
void fun1_Math_floor(devs_ctx_t *ctx);
void fun1_Math_round(devs_ctx_t *ctx);
void fun1_Math_abs(devs_ctx_t *ctx);
void fun0_Math_random(devs_ctx_t *ctx);
void fun1_Math_randomInt(devs_ctx_t *ctx);
void fun1_Math_log(devs_ctx_t *ctx);
void fun2_Math_pow(devs_ctx_t *ctx);
void fun2_Math_idiv(devs_ctx_t *ctx);
void fun2_Math_imod(devs_ctx_t *ctx);
void fun2_Math_imul(devs_ctx_t *ctx);
void fun2_Math_min(devs_ctx_t *ctx);
void fun2_Math_max(devs_ctx_t *ctx);
// impl_object.c
void fun2_Object_assign(devs_ctx_t *ctx);
void fun1_Object_keys(devs_ctx_t *ctx);
void fun1_Object_values(devs_ctx_t *ctx);
void fun2_Object_setPrototypeOf(devs_ctx_t *ctx);
// impl_packet.c
value_t prop_DsPacket_role(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacket_deviceIdentifier(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacket_shortId(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacket_serviceIndex(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacket_serviceCommand(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacket_flags(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacket_isCommand(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacket_isReport(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacket_payload(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacket_isEvent(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacket_eventCode(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacket_isRegSet(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacket_isRegGet(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacket_regCode(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacket_isAction(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacket_spec(devs_ctx_t *ctx, value_t self);
void meth0_DsPacket_decode(devs_ctx_t *ctx);
void meth0_DsPacket_notImplemented(devs_ctx_t *ctx);
// impl_packetspec.c
value_t prop_DsPacketSpec_parent(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacketSpec_name(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacketSpec_code(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacketSpec_response(devs_ctx_t *ctx, value_t self);
void methX_DsPacketSpec_encode(devs_ctx_t *ctx);
// impl_register.c
void meth0_DsRegister_read(devs_ctx_t *ctx);
void methX_DsRegister_write(devs_ctx_t *ctx);
value_t prop_DsPacketInfo_role(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacketInfo_name(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacketInfo_code(devs_ctx_t *ctx, value_t self);
void methX_DsCommand___func__(devs_ctx_t *ctx);
// impl_role.c
value_t prop_DsRole_isBound(devs_ctx_t *ctx, value_t self);
value_t prop_DsRole_spec(devs_ctx_t *ctx, value_t self);
void meth2_DsRole_sendCommand(devs_ctx_t *ctx);
// impl_servicespec.c
value_t prop_DsServiceSpec_classIdentifier(devs_ctx_t *ctx, value_t self);
value_t prop_DsServiceSpec_name(devs_ctx_t *ctx, value_t self);
void meth1_DsServiceSpec_lookup(devs_ctx_t *ctx);
void meth1_DsServiceSpec_assign(devs_ctx_t *ctx);
// impl_string.c
value_t prop_String_length(devs_ctx_t *ctx, value_t self);
void meth1_String_charCodeAt(devs_ctx_t *ctx);
void meth1_String_charAt(devs_ctx_t *ctx);
void meth2_String_slice(devs_ctx_t *ctx);
void funX_String_fromCharCode(devs_ctx_t *ctx);

static const devs_builtin_proto_entry_t Array_prototype_entries[] = { //
    {N(LENGTH), 50000},                                               //
    {N(INSERT), 50001},                                               //
    {N(PUSH), 50003},                                                 //
    {N(PUSHRANGE), 50004},                                            //
    {N(SLICE), 50005},                                                //
    {N(JOIN), 50006},                                                 //
    {0, 0}};

static const devs_builtin_proto_entry_t Array_entries[] = { //
    {N(ISARRAY), 50002},                                    //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_ARRAY_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t Buffer_entries[] = { //
    {N(ALLOC), 50007},                                       //
    {N(FROM), 50008},                                        //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_BUFFER_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t Buffer_prototype_entries[] = { //
    {N(LENGTH), 50009},                                                //
    {N(TOSTRING), 50010},                                              //
    {N(FILLAT), 50011},                                                //
    {N(BLITAT), 50012},                                                //
    {0, 0}};

static const devs_builtin_proto_entry_t DeviceScript_entries[] = { //
    {N(SLEEP), 50013},                                             //
    {N(DELAY), 50014},                                             //
    {N(_PANIC), 50015},                                            //
    {N(REBOOT), 50016},                                            //
    {N(RESTART), 50017},                                           //
    {N(FORMAT), 50018},                                            //
    {N(PRINT), 50019},                                             //
    {N(PARSEFLOAT), 50020},                                        //
    {N(PARSEINT), 50021},                                          //
    {N(_LOGREPR), 50022},                                          //
    {N(_DCFGSTRING), 50023},                                       //
    {N(MILLIS), 50024},                                            //
    {N(DEVICEIDENTIFIER), 50025},                                  //
    {N(_SERVERSEND), 50026},                                       //
    {N(_ALLOCROLE), 50027},                                        //
    {N(SPICONFIGURE), 50028},                                      //
    {N(SPIXFER), 50029},                                           //
    {N(SUSPEND), 50040},                                           //
    {0, 0}};

static const devs_builtin_proto_entry_t TypeError_prototype_entries[] = { //
    {N(CONSTRUCTOR), 50032},                                              //
    {0, 0}};

static const devs_builtin_proto_entry_t RangeError_prototype_entries[] = { //
    {N(CONSTRUCTOR), 50031},                                               //
    {0, 0}};

static const devs_builtin_proto_entry_t Error_entries[] = { //
    {N(__FUNC__), 50030},                                   //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_ERROR_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t Error_prototype_entries[] = { //
    {N(CONSTRUCTOR), 50030},                                          //
    {N(NAME), 50034},                                                 //
    {N(PRINT), 50035},                                                //
    {0, 0}};

static const devs_builtin_proto_entry_t RangeError_entries[] = { //
    {N(__FUNC__), 50031},                                        //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_RANGEERROR_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t TypeError_entries[] = { //
    {N(__FUNC__), 50032},                                       //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_TYPEERROR_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t SyntaxError_entries[] = { //
    {N(__FUNC__), 50033},                                         //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_SYNTAXERROR_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t SyntaxError_prototype_entries[] = { //
    {N(CONSTRUCTOR), 50033},                                                //
    {0, 0}};

static const devs_builtin_proto_entry_t DsFiber_prototype_entries[] = { //
    {N(ID), 50036},                                                     //
    {N(SUSPENDED), 50037},                                              //
    {N(RESUME), 50038},                                                 //
    {N(TERMINATE), 50039},                                              //
    {0, 0}};

static const devs_builtin_proto_entry_t DsFiber_entries[] = { //
    {N(SELF), 50041},                                         //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_DSFIBER_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t Function_prototype_entries[] = { //
    {N(START), 50042},                                                   //
    {N(PROTOTYPE), 50043},                                               //
    {N(NAME), 50044},                                                    //
    {0, 0}};

static const devs_builtin_proto_entry_t Image_prototype_entries[] = { //
    {N(WIDTH), 50045},                                                //
    {N(HEIGHT), 50046},                                               //
    {N(BPP), 50047},                                                  //
    {N(SET), 50049},                                                  //
    {N(GET), 50050},                                                  //
    {N(FILL), 50051},                                                 //
    {N(FILLRECT), 50052},                                             //
    {N(EQUALS), 50053},                                               //
    {N(CLONE), 50054},                                                //
    {N(FLIPX), 50055},                                                //
    {N(FLIPY), 50056},                                                //
    {N(TRANSPOSED), 50057},                                           //
    {N(DRAWIMAGE), 50058},                                            //
    {N(DRAWTRANSPARENTIMAGE), 50059},                                 //
    {N(OVERLAPSWITH), 50060},                                         //
    {N(DRAWLINE), 50061},                                             //
    {N(BLITROW), 50062},                                              //
    {N(BLIT), 50063},                                                 //
    {N(FILLCIRCLE), 50064},                                           //
    {0, 0}};

static const devs_builtin_proto_entry_t Image_entries[] = { //
    {N(ALLOC), 50048},                                      //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_IMAGE_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t JSON_entries[] = { //
    {N(PARSE), 50065},                                     //
    {N(STRINGIFY), 50066},                                 //
    {0, 0}};

static const devs_builtin_proto_entry_t Math_entries[] = { //
    {N(CEIL), 50067},                                      //
    {N(FLOOR), 50068},                                     //
    {N(ROUND), 50069},                                     //
    {N(ABS), 50070},                                       //
    {N(RANDOM), 50071},                                    //
    {N(RANDOMINT), 50072},                                 //
    {N(LOG), 50073},                                       //
    {N(POW), 50074},                                       //
    {N(IDIV), 50075},                                      //
    {N(IMOD), 50076},                                      //
    {N(IMUL), 50077},                                      //
    {N(MIN), 50078},                                       //
    {N(MAX), 50079},                                       //
    {0, 0}};

static const devs_builtin_proto_entry_t Object_entries[] = { //
    {N(ASSIGN), 50080},                                      //
    {N(KEYS), 50081},                                        //
    {N(VALUES), 50082},                                      //
    {N(SETPROTOTYPEOF), 50083},                              //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_OBJECT_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t DsPacket_prototype_entries[] = { //
    {N(ROLE), 50084},                                                    //
    {N(DEVICEIDENTIFIER), 50085},                                        //
    {N(SHORTID), 50086},                                                 //
    {N(SERVICEINDEX), 50087},                                            //
    {N(SERVICECOMMAND), 50088},                                          //
    {N(FLAGS), 50089},                                                   //
    {N(ISCOMMAND), 50090},                                               //
    {N(ISREPORT), 50091},                                                //
    {N(PAYLOAD), 50092},                                                 //
    {N(ISEVENT), 50093},                                                 //
    {N(EVENTCODE), 50094},                                               //
    {N(ISREGSET), 50095},                                                //
    {N(ISREGGET), 50096},                                                //
    {N(REGCODE), 50097},                                                 //
    {N(ISACTION), 50098},                                                //
    {N(SPEC), 50099},                                                    //
    {N(DECODE), 50100},                                                  //
    {N(NOTIMPLEMENTED), 50101},                                          //
    {0, 0}};

static const devs_builtin_proto_entry_t DsPacketSpec_prototype_entries[] = { //
    {N(PARENT), 50102},                                                      //
    {N(NAME), 50103},                                                        //
    {N(CODE), 50104},                                                        //
    {N(RESPONSE), 50105},                                                    //
    {N(ENCODE), 50106},                                                      //
    {0, 0}};

static const devs_builtin_proto_entry_t DsRegister_prototype_entries[] = { //
    {N(READ), 50107},                                                      //
    {N(WRITE), 50108},                                                     //
    {0, 0}};

static const devs_builtin_proto_entry_t DsCommand_prototype_entries[] = { //
    {N(__FUNC__), 50112},                                                 //
    {0, 0}};

static const devs_builtin_proto_entry_t DsEvent_prototype_entries[] = { //
    {0, 0}};

static const devs_builtin_proto_entry_t DsPacketInfo_prototype_entries[] = { //
    {N(ROLE), 50109},                                                        //
    {N(NAME), 50110},                                                        //
    {N(CODE), 50111},                                                        //
    {0, 0}};

static const devs_builtin_proto_entry_t DsRole_prototype_entries[] = { //
    {N(ISBOUND), 50113},                                               //
    {N(SPEC), 50114},                                                  //
    {N(SENDCOMMAND), 50115},                                           //
    {0, 0}};

static const devs_builtin_proto_entry_t DsServiceSpec_prototype_entries[] = { //
    {N(CLASSIDENTIFIER), 50116},                                              //
    {N(NAME), 50117},                                                         //
    {N(LOOKUP), 50118},                                                       //
    {N(ASSIGN), 50119},                                                       //
    {0, 0}};

static const devs_builtin_proto_entry_t String_prototype_entries[] = { //
    {N(LENGTH), 50120},                                                //
    {N(CHARCODEAT), 50121},                                            //
    {N(CHARAT), 50122},                                                //
    {N(SLICE), 50123},                                                 //
    {0, 0}};

static const devs_builtin_proto_entry_t String_entries[] = { //
    {N(FROMCHARCODE), 50124},                                //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_STRING_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t empty_entries[] = { //
    {0, 0}};

static const devs_builtin_proto_entry_t number_entries[] = { //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_NUMBER_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t dsrole_entries[] = { //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_DSROLE_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t function_entries[] = { //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_FUNCTION_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t boolean_entries[] = { //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_BOOLEAN_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t dspacket_entries[] = { //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_DSPACKET_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t dsservicespec_entries[] = { //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_DSSERVICESPEC_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t dspacketspec_entries[] = { //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_DSPACKETSPEC_PROTOTYPE},    //
    {0, 0}};

const devs_builtin_proto_t devs_builtin_protos[DEVS_BUILTIN_OBJECT___MAX + 1] = {
    [DEVS_BUILTIN_OBJECT_ARRAY_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL,
                                             Array_prototype_entries},
    [DEVS_BUILTIN_OBJECT_ARRAY] = {DEVS_BUILTIN_PROTO_INIT, NULL, Array_entries},
    [DEVS_BUILTIN_OBJECT_BUFFER] = {DEVS_BUILTIN_PROTO_INIT, NULL, Buffer_entries},
    [DEVS_BUILTIN_OBJECT_BUFFER_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL,
                                              Buffer_prototype_entries},
    [DEVS_BUILTIN_OBJECT_DEVICESCRIPT] = {DEVS_BUILTIN_PROTO_INIT, NULL, DeviceScript_entries},
    [DEVS_BUILTIN_OBJECT_TYPEERROR_PROTOTYPE] =
        {DEVS_BUILTIN_PROTO_INIT, &devs_builtin_protos[DEVS_BUILTIN_OBJECT_ERROR_PROTOTYPE],
         TypeError_prototype_entries},
    [DEVS_BUILTIN_OBJECT_RANGEERROR_PROTOTYPE] =
        {DEVS_BUILTIN_PROTO_INIT, &devs_builtin_protos[DEVS_BUILTIN_OBJECT_ERROR_PROTOTYPE],
         RangeError_prototype_entries},
    [DEVS_BUILTIN_OBJECT_ERROR] = {DEVS_BUILTIN_PROTO_INIT, NULL, Error_entries},
    [DEVS_BUILTIN_OBJECT_ERROR_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL,
                                             Error_prototype_entries},
    [DEVS_BUILTIN_OBJECT_RANGEERROR] = {DEVS_BUILTIN_PROTO_INIT, NULL, RangeError_entries},
    [DEVS_BUILTIN_OBJECT_TYPEERROR] = {DEVS_BUILTIN_PROTO_INIT, NULL, TypeError_entries},
    [DEVS_BUILTIN_OBJECT_SYNTAXERROR] = {DEVS_BUILTIN_PROTO_INIT, NULL, SyntaxError_entries},
    [DEVS_BUILTIN_OBJECT_SYNTAXERROR_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL,
                                                   SyntaxError_prototype_entries},
    [DEVS_BUILTIN_OBJECT_DSFIBER_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL,
                                               DsFiber_prototype_entries},
    [DEVS_BUILTIN_OBJECT_DSFIBER] = {DEVS_BUILTIN_PROTO_INIT, NULL, DsFiber_entries},
    [DEVS_BUILTIN_OBJECT_FUNCTION_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL,
                                                Function_prototype_entries},
    [DEVS_BUILTIN_OBJECT_IMAGE_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL,
                                             Image_prototype_entries},
    [DEVS_BUILTIN_OBJECT_IMAGE] = {DEVS_BUILTIN_PROTO_INIT, NULL, Image_entries},
    [DEVS_BUILTIN_OBJECT_JSON] = {DEVS_BUILTIN_PROTO_INIT, NULL, JSON_entries},
    [DEVS_BUILTIN_OBJECT_MATH] = {DEVS_BUILTIN_PROTO_INIT, NULL, Math_entries},
    [DEVS_BUILTIN_OBJECT_OBJECT] = {DEVS_BUILTIN_PROTO_INIT, NULL, Object_entries},
    [DEVS_BUILTIN_OBJECT_DSPACKET_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL,
                                                DsPacket_prototype_entries},
    [DEVS_BUILTIN_OBJECT_DSPACKETSPEC_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL,
                                                    DsPacketSpec_prototype_entries},
    [DEVS_BUILTIN_OBJECT_DSREGISTER_PROTOTYPE] =
        {DEVS_BUILTIN_PROTO_INIT, &devs_builtin_protos[DEVS_BUILTIN_OBJECT_DSPACKETINFO_PROTOTYPE],
         DsRegister_prototype_entries},
    [DEVS_BUILTIN_OBJECT_DSCOMMAND_PROTOTYPE] =
        {DEVS_BUILTIN_PROTO_INIT, &devs_builtin_protos[DEVS_BUILTIN_OBJECT_DSPACKETINFO_PROTOTYPE],
         DsCommand_prototype_entries},
    [DEVS_BUILTIN_OBJECT_DSEVENT_PROTOTYPE] =
        {DEVS_BUILTIN_PROTO_INIT, &devs_builtin_protos[DEVS_BUILTIN_OBJECT_DSPACKETINFO_PROTOTYPE],
         DsEvent_prototype_entries},
    [DEVS_BUILTIN_OBJECT_DSPACKETINFO_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL,
                                                    DsPacketInfo_prototype_entries},
    [DEVS_BUILTIN_OBJECT_DSROLE_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL,
                                              DsRole_prototype_entries},
    [DEVS_BUILTIN_OBJECT_DSSERVICESPEC_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL,
                                                     DsServiceSpec_prototype_entries},
    [DEVS_BUILTIN_OBJECT_STRING_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL,
                                              String_prototype_entries},
    [DEVS_BUILTIN_OBJECT_STRING] = {DEVS_BUILTIN_PROTO_INIT, NULL, String_entries},
    [DEVS_BUILTIN_OBJECT_NUMBER] = {DEVS_BUILTIN_PROTO_INIT, NULL, number_entries},
    [DEVS_BUILTIN_OBJECT_DSROLE] = {DEVS_BUILTIN_PROTO_INIT, NULL, dsrole_entries},
    [DEVS_BUILTIN_OBJECT_FUNCTION] = {DEVS_BUILTIN_PROTO_INIT, NULL, function_entries},
    [DEVS_BUILTIN_OBJECT_BOOLEAN] = {DEVS_BUILTIN_PROTO_INIT, NULL, boolean_entries},
    [DEVS_BUILTIN_OBJECT_DSPACKET] = {DEVS_BUILTIN_PROTO_INIT, NULL, dspacket_entries},
    [DEVS_BUILTIN_OBJECT_DSSERVICESPEC] = {DEVS_BUILTIN_PROTO_INIT, NULL, dsservicespec_entries},
    [DEVS_BUILTIN_OBJECT_DSPACKETSPEC] = {DEVS_BUILTIN_PROTO_INIT, NULL, dspacketspec_entries},
    [DEVS_BUILTIN_OBJECT_OBJECT_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL, empty_entries},
    [DEVS_BUILTIN_OBJECT_NUMBER_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL, empty_entries},
    [DEVS_BUILTIN_OBJECT_BOOLEAN_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL, empty_entries},
    [DEVS_BUILTIN_OBJECT_DSREPORT_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL, empty_entries},
};

uint16_t devs_num_builtin_functions = 125;
const devs_builtin_function_t devs_builtin_functions[125] = {
    {N(LENGTH), 0, PROP, {.prop = prop_Array_length}},
    {N(INSERT), 2, 0, {.meth = meth2_Array_insert}},
    {N(ISARRAY), 1, NO_SELF, {.meth = fun1_Array_isArray}},
    {N(PUSH), 0, 0, {.meth = methX_Array_push}},
    {N(PUSHRANGE), 1, 0, {.meth = meth1_Array_pushRange}},
    {N(SLICE), 0, 0, {.meth = methX_Array_slice}},
    {N(JOIN), 1, 0, {.meth = meth1_Array_join}},
    {N(ALLOC), 1, NO_SELF, {.meth = fun1_Buffer_alloc}},
    {N(FROM), 1, NO_SELF, {.meth = fun1_Buffer_from}},
    {N(LENGTH), 0, PROP, {.prop = prop_Buffer_length}},
    {N(TOSTRING), 1, 0, {.meth = meth1_Buffer_toString}},
    {N(FILLAT), 3, 0, {.meth = meth3_Buffer_fillAt}},
    {N(BLITAT), 4, 0, {.meth = meth4_Buffer_blitAt}},
    {N(SLEEP), 1, NO_SELF, {.meth = fun1_DeviceScript_sleep}},
    {N(DELAY), 1, NO_SELF, {.meth = fun1_DeviceScript_delay}},
    {N(_PANIC), 1, NO_SELF, {.meth = fun1_DeviceScript__panic}},
    {N(REBOOT), 0, NO_SELF, {.meth = fun0_DeviceScript_reboot}},
    {N(RESTART), 0, NO_SELF, {.meth = fun0_DeviceScript_restart}},
    {N(FORMAT), 0, NO_SELF, {.meth = funX_DeviceScript_format}},
    {N(PRINT), 2, NO_SELF, {.meth = fun2_DeviceScript_print}},
    {N(PARSEFLOAT), 1, NO_SELF, {.meth = fun1_DeviceScript_parseFloat}},
    {N(PARSEINT), 1, NO_SELF, {.meth = fun1_DeviceScript_parseInt}},
    {N(_LOGREPR), 2, NO_SELF, {.meth = fun2_DeviceScript__logRepr}},
    {N(_DCFGSTRING), 1, NO_SELF, {.meth = fun1_DeviceScript__dcfgString}},
    {N(MILLIS), 0, NO_SELF, {.meth = fun0_DeviceScript_millis}},
    {N(DEVICEIDENTIFIER), 1, NO_SELF, {.meth = fun1_DeviceScript_deviceIdentifier}},
    {N(_SERVERSEND), 2, NO_SELF, {.meth = fun2_DeviceScript__serverSend}},
    {N(_ALLOCROLE), 2, NO_SELF, {.meth = fun2_DeviceScript__allocRole}},
    {N(SPICONFIGURE), 5, NO_SELF, {.meth = fun5_DeviceScript_spiConfigure}},
    {N(SPIXFER), 2, NO_SELF, {.meth = fun2_DeviceScript_spiXfer}},
    {N(ERROR), 1, CTOR, {.meth = meth1_Error___ctor__}},
    {N(RANGEERROR), 1, CTOR, {.meth = meth1_RangeError___ctor__}},
    {N(TYPEERROR), 1, CTOR, {.meth = meth1_TypeError___ctor__}},
    {N(SYNTAXERROR), 1, CTOR, {.meth = meth1_SyntaxError___ctor__}},
    {N(NAME), 0, PROP, {.prop = prop_Error_name}},
    {N(PRINT), 0, 0, {.meth = meth0_Error_print}},
    {N(ID), 0, PROP, {.prop = prop_DsFiber_id}},
    {N(SUSPENDED), 0, PROP, {.prop = prop_DsFiber_suspended}},
    {N(RESUME), 1, 0, {.meth = meth1_DsFiber_resume}},
    {N(TERMINATE), 0, 0, {.meth = meth0_DsFiber_terminate}},
    {N(SUSPEND), 1, NO_SELF, {.meth = fun1_DeviceScript_suspend}},
    {N(SELF), 0, NO_SELF, {.meth = fun0_DsFiber_self}},
    {N(START), 0, 0, {.meth = methX_Function_start}},
    {N(PROTOTYPE), 0, PROP, {.prop = prop_Function_prototype}},
    {N(NAME), 0, PROP, {.prop = prop_Function_name}},
    {N(WIDTH), 0, PROP, {.prop = prop_Image_width}},
    {N(HEIGHT), 0, PROP, {.prop = prop_Image_height}},
    {N(BPP), 0, PROP, {.prop = prop_Image_bpp}},
    {N(ALLOC), 5, NO_SELF, {.meth = fun5_Image_alloc}},
    {N(SET), 3, 0, {.meth = meth3_Image_set}},
    {N(GET), 2, 0, {.meth = meth2_Image_get}},
    {N(FILL), 1, 0, {.meth = meth1_Image_fill}},
    {N(FILLRECT), 5, 0, {.meth = meth5_Image_fillRect}},
    {N(EQUALS), 1, 0, {.meth = meth1_Image_equals}},
    {N(CLONE), 0, 0, {.meth = meth0_Image_clone}},
    {N(FLIPX), 0, 0, {.meth = meth0_Image_flipX}},
    {N(FLIPY), 0, 0, {.meth = meth0_Image_flipY}},
    {N(TRANSPOSED), 0, 0, {.meth = meth0_Image_transposed}},
    {N(DRAWIMAGE), 3, 0, {.meth = meth3_Image_drawImage}},
    {N(DRAWTRANSPARENTIMAGE), 4, 0, {.meth = meth4_Image_drawTransparentImage}},
    {N(OVERLAPSWITH), 3, 0, {.meth = meth3_Image_overlapsWith}},
    {N(DRAWLINE), 5, 0, {.meth = meth5_Image_drawLine}},
    {N(BLITROW), 5, 0, {.meth = meth5_Image_blitRow}},
    {N(BLIT), 11, 0, {.meth = meth11_Image_blit}},
    {N(FILLCIRCLE), 4, 0, {.meth = meth4_Image_fillCircle}},
    {N(PARSE), 2, NO_SELF, {.meth = fun2_JSON_parse}},
    {N(STRINGIFY), 3, NO_SELF, {.meth = fun3_JSON_stringify}},
    {N(CEIL), 1, NO_SELF, {.meth = fun1_Math_ceil}},
    {N(FLOOR), 1, NO_SELF, {.meth = fun1_Math_floor}},
    {N(ROUND), 1, NO_SELF, {.meth = fun1_Math_round}},
    {N(ABS), 1, NO_SELF, {.meth = fun1_Math_abs}},
    {N(RANDOM), 0, NO_SELF, {.meth = fun0_Math_random}},
    {N(RANDOMINT), 1, NO_SELF, {.meth = fun1_Math_randomInt}},
    {N(LOG), 1, NO_SELF, {.meth = fun1_Math_log}},
    {N(POW), 2, NO_SELF, {.meth = fun2_Math_pow}},
    {N(IDIV), 2, NO_SELF, {.meth = fun2_Math_idiv}},
    {N(IMOD), 2, NO_SELF, {.meth = fun2_Math_imod}},
    {N(IMUL), 2, NO_SELF, {.meth = fun2_Math_imul}},
    {N(MIN), 2, NO_SELF, {.meth = fun2_Math_min}},
    {N(MAX), 2, NO_SELF, {.meth = fun2_Math_max}},
    {N(ASSIGN), 2, NO_SELF, {.meth = fun2_Object_assign}},
    {N(KEYS), 1, NO_SELF, {.meth = fun1_Object_keys}},
    {N(VALUES), 1, NO_SELF, {.meth = fun1_Object_values}},
    {N(SETPROTOTYPEOF), 2, NO_SELF, {.meth = fun2_Object_setPrototypeOf}},
    {N(ROLE), 0, PROP, {.prop = prop_DsPacket_role}},
    {N(DEVICEIDENTIFIER), 0, PROP, {.prop = prop_DsPacket_deviceIdentifier}},
    {N(SHORTID), 0, PROP, {.prop = prop_DsPacket_shortId}},
    {N(SERVICEINDEX), 0, PROP, {.prop = prop_DsPacket_serviceIndex}},
    {N(SERVICECOMMAND), 0, PROP, {.prop = prop_DsPacket_serviceCommand}},
    {N(FLAGS), 0, PROP, {.prop = prop_DsPacket_flags}},
    {N(ISCOMMAND), 0, PROP, {.prop = prop_DsPacket_isCommand}},
    {N(ISREPORT), 0, PROP, {.prop = prop_DsPacket_isReport}},
    {N(PAYLOAD), 0, PROP, {.prop = prop_DsPacket_payload}},
    {N(ISEVENT), 0, PROP, {.prop = prop_DsPacket_isEvent}},
    {N(EVENTCODE), 0, PROP, {.prop = prop_DsPacket_eventCode}},
    {N(ISREGSET), 0, PROP, {.prop = prop_DsPacket_isRegSet}},
    {N(ISREGGET), 0, PROP, {.prop = prop_DsPacket_isRegGet}},
    {N(REGCODE), 0, PROP, {.prop = prop_DsPacket_regCode}},
    {N(ISACTION), 0, PROP, {.prop = prop_DsPacket_isAction}},
    {N(SPEC), 0, PROP, {.prop = prop_DsPacket_spec}},
    {N(DECODE), 0, 0, {.meth = meth0_DsPacket_decode}},
    {N(NOTIMPLEMENTED), 0, 0, {.meth = meth0_DsPacket_notImplemented}},
    {N(PARENT), 0, PROP, {.prop = prop_DsPacketSpec_parent}},
    {N(NAME), 0, PROP, {.prop = prop_DsPacketSpec_name}},
    {N(CODE), 0, PROP, {.prop = prop_DsPacketSpec_code}},
    {N(RESPONSE), 0, PROP, {.prop = prop_DsPacketSpec_response}},
    {N(ENCODE), 0, 0, {.meth = methX_DsPacketSpec_encode}},
    {N(READ), 0, 0, {.meth = meth0_DsRegister_read}},
    {N(WRITE), 0, 0, {.meth = methX_DsRegister_write}},
    {N(ROLE), 0, PROP, {.prop = prop_DsPacketInfo_role}},
    {N(NAME), 0, PROP, {.prop = prop_DsPacketInfo_name}},
    {N(CODE), 0, PROP, {.prop = prop_DsPacketInfo_code}},
    {N(__FUNC__), 0, 0, {.meth = methX_DsCommand___func__}},
    {N(ISBOUND), 0, PROP, {.prop = prop_DsRole_isBound}},
    {N(SPEC), 0, PROP, {.prop = prop_DsRole_spec}},
    {N(SENDCOMMAND), 2, 0, {.meth = meth2_DsRole_sendCommand}},
    {N(CLASSIDENTIFIER), 0, PROP, {.prop = prop_DsServiceSpec_classIdentifier}},
    {N(NAME), 0, PROP, {.prop = prop_DsServiceSpec_name}},
    {N(LOOKUP), 1, 0, {.meth = meth1_DsServiceSpec_lookup}},
    {N(ASSIGN), 1, 0, {.meth = meth1_DsServiceSpec_assign}},
    {N(LENGTH), 0, PROP, {.prop = prop_String_length}},
    {N(CHARCODEAT), 1, 0, {.meth = meth1_String_charCodeAt}},
    {N(CHARAT), 1, 0, {.meth = meth1_String_charAt}},
    {N(SLICE), 2, 0, {.meth = meth2_String_slice}},
    {N(FROMCHARCODE), 0, NO_SELF, {.meth = funX_String_fromCharCode}}};

STATIC_ASSERT(11 <= DEVS_BUILTIN_MAX_ARGS);
STATIC_ASSERT(50000 == DEVS_FIRST_BUILTIN_FUNCTION);
